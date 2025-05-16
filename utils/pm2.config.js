;
// pm2.config.js;
module.exports = {
  apps: [;
    {
      name: "prizelobby-api",;
      script: "./server.js",;
      watch: false;
    },;
    {
      name: "prizelobby-scheduler",;
      script: "./scheduler.js",;
      watch: false;
    }
  ];
};