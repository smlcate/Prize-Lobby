const express = require('express');
const app = express();
const helmet = require('helmet');
const cors = require('cors');
const path = require('path');

require('dotenv').config();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  helmet.contentSecurityPolicy({
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'", "https://js.stripe.com", "https://ajax.googleapis.com", "https://cdnjs.cloudflare.com"],
      scriptSrcElem: ["'self'", "https://js.stripe.com", "https://ajax.googleapis.com", "https://cdnjs.cloudflare.com"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com", "https://cdn.jsdelivr.net"],
      styleSrcElem: ["'self'", "https://fonts.googleapis.com", "https://cdn.jsdelivr.net"],
      fontSrc: ["'self'", "https://fonts.gstatic.com"],
      imgSrc: ["'self'", "data:"],
      connectSrc: ["'self'", "http://localhost:3000", "ws://localhost:3000"],
      frameSrc: ["'self'", "https://js.stripe.com"]
    },
  })
);

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/events', require('./routes/events'));
app.use('/api/challenges', require('./routes/challenges'));
app.use('/api/users', require('./routes/users'));
app.use('/api/wallet', require('./routes/wallet'));
app.use('/api/transactions', require('./routes/transactions'));
app.use('/api/admin', require('./routes/admin'));
app.use('/api/notifications', require('./routes/notifications'));
app.use('/api/teams', require('./routes/teams'));
app.use('/api/disputes', require('./routes/disputes'));
app.use('/api/gamertags', require('./routes/gamertags'));
app.use('/api/matches', require('./routes/matches'));

// Static
app.use(express.static(path.join(__dirname, 'public')));
app.get(/^\/((?!api\/).)*$/, (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

module.exports = app;