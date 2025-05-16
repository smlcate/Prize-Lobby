require('dotenv').config();

const express = require('express');
const app = express();
const http = require('http').Server(app);
const path = require('path');
const cors = require('cors');
const morgan = require('morgan');
const dotenv = require('dotenv');
const jwt = require('jsonwebtoken');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const io = require('socket.io')(http);
const db = require('./models/db');

require('./autoVerifyCron');


const JWT_SECRET = process.env.JWT_SECRET || 'your_super_secret_jwt_key';
console.log('🔐 Using JWT_SECRET:', JWT_SECRET);

// === EARLY middleware ===
app.use(cors());
app.use(morgan('dev'));
app.use(express.static(path.join(__dirname, 'public')));
app.locals.io = io;

// ✅ Stripe webhook: must use raw body before JSON parser
app.post('/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.error('❌ Webhook signature verification failed:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type === 'payment_intent.succeeded') {
    const intent = event.data.object;
    const userId = parseInt(intent.metadata.user_id, 10);
    const amount = intent.amount;

    console.log(`💵 PaymentIntent succeeded for user ${userId}, amount: ${amount}`);

    try {
      await db('wallets').where({ user_id: userId }).increment('balance', amount);
      await db('transactions').insert({ user_id: userId, amount, type: 'deposit' });
      return res.status(200).json({ received: true });
    } catch (err) {
      console.error('❌ DB update failed:', err);
      return res.status(500).json({ error: 'DB update failed' });
    }
  }

  res.status(200).json({ received: true });
});

// JSON body parsing AFTER webhook
const bodyParser = require('body-parser');
app.use(bodyParser.json());

const authRoutes = require('./routes/auth');
app.use('/api/auth', authRoutes); // no auth required

const authenticate = require('./middleware/authenticate');
app.use(authenticate); // all routes below this require token

// Protected routes
app.use('/api/wallet', require('./routes/wallet'));
app.use('/api/events', require('./routes/events'));
app.use('/api/admin', require('./routes/admin'));
app.use('/api/admin', require('./routes/adminDisputes'));
app.use('/api/admin/settings', require('./routes/adminSettings'));
app.use('/api/verify', require('./routes/verification'));
app.use('/api/users', require('./routes/users'));
app.use('/api/gamertags', require('./routes/gamertags'));
app.use('/api/challenges', require('./routes/challenges'));
app.use('/api/transactions', require('./routes/transactions'));
app.use('/api', require('./routes/withdrawals'));
app.use('/api/matches', require('./routes/matches'));

// === SOCKET.IO ===
const activeUsers = {};
io.on('connection', (socket) => {
  console.log('🔌 Socket connected:', socket.id);

  socket.on('register', (userId) => {
    if (userId) {
      activeUsers[userId] = socket.id;
      console.log(`🔔 Registered Socket.IO for user ${userId}`);
    }
  });

  socket.on('disconnect', () => {
    const user = Object.keys(activeUsers).find(id => activeUsers[id] === socket.id);
    if (user) delete activeUsers[user];
  });
});
app.locals.activeUsers = activeUsers;

// === DEV ROUTES (optional) ===
if (process.env.NODE_ENV !== 'production') {
  const devRoutes = require('./routes/dev');
  app.use('/api/dev', devRoutes);
}

// === ANGULARJS FALLBACK (NO *) ===
app.use((req, res, next) => {
  if (req.method === 'GET' && !req.url.startsWith('/api/')) {
    return res.sendFile(path.join(__dirname, 'public', 'index.html'));
  }
  next();
});

// === START SERVER ===
const PORT = process.env.PORT || 3000;
http.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
