const TelegramBot = require('node-telegram-bot-api');
const database = require('./db/database');

const bot = new TelegramBot('6127650887:AAHslvbQP5BITTV8j4MFpo0R7lbvrZyz8zM', { polling: true });

// Handle /start command
bot.onText(/\/start/, async (msg) => {
  const chatId = msg.chat.id;
  const username = msg.from.username;

  try {
    // Check if the user is already subscribed
    const isSubscribed = await database.isSubscriber(username);

    if (!isSubscribed) {
      // Store subscriber details in the database
      await database.storeSubscriber(username, chatId);
      bot.sendMessage(chatId, 'Welcome to the Weather Bot! Type /subscribe to get daily weather updates.');
    } else {
      bot.sendMessage(chatId, 'You are already subscribed. Now you get daily weather updates.');
    }
  } catch (error) {
    console.error('Error processing /start command:', error);
    bot.sendMessage(chatId, 'An error occurred while processing your request.');
  }
});

// Handle /subscribe command
bot.onText(/\/subscribe/, async (msg) => {
  const chatId = msg.chat.id;
  const username = msg.from.username;

  try {
    // Check if the user is already subscribed
    const isSubscribed = await database.isSubscriber(username);

    if (!isSubscribed) {
      // Store subscriber details in the database
      await database.storeSubscriber(username, chatId);
      bot.sendMessage(chatId, 'You are now subscribed to daily weather updates.');
    } else {
      bot.sendMessage(chatId, 'You are already subscribed. now you get daily weather updates.');
    }
  } catch (error) {
    console.error('Error processing /subscribe command:', error);
    bot.sendMessage(chatId, 'An error occurred while processing your request.');
  }
});

module.exports = bot;
