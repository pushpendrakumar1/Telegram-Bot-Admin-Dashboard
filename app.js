const expressServer = require('./express-server');
const telegramBot = require('./telegram-bot');

// Start the Express.js server
const port = process.env.PORT || 3000;
expressServer.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});
