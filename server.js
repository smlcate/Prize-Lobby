const http = require('http');
const app = require('./app');
const httpServer = http.createServer(app);
const PORT = process.env.PORT || 3000;

require('./services/socket')(httpServer);

if (require.main === module) {
  httpServer.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
  });
}

module.exports = httpServer;