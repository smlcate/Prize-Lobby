require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const cors = require('cors');

const app = express();

// ⚠️ Mount the webhook route first, before JSON parser
app.use('/webhook', require('./routes/webhook'));

// 🔐 Apply JSON body parsing for all remaining routes
app.use(bodyParser.json({ limit: '20mb' }));
app.use(cors());
app.use(express.static('public'));

// ✅ Route files
app.use('/api/auth', require('./routes/auth'));
app.use('/api/wallet', require('./routes/wallet'));
app.use('/api/events', require('./routes/events'));
app.use('/api/gamertags', require('./routes/gamertags'));

app.use('/api/transactions', require('./routes/transactions'));

app.use('/api/admin', require('./routes/admin'));

// ✅ Angular catch-all route for client-side routing
app.get(/^\/(?!api|webhook).*/, (req, res) => {
  res.sendFile(path.join(__dirname, 'public/index.html'));
});

// ✅ Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 PrizeLobby server running on port ${PORT}`);
});
