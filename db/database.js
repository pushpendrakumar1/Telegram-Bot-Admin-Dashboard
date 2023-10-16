const { MongoClient, ObjectId } = require('mongodb');

const uri = 'mongodb://localhost:27017';
const client = new MongoClient(uri);
let db; // A reference to the MongoDB database

async function connectToDatabase() {
  try {
    await client.connect();
    db = client.db('db'); // Replace 'db' with your database name
  } catch (error) {
    console.error('Error connecting to the database:', error);
    throw error;
  }
}

async function storeSubscriber(username, chatId, email) {
  try {
    if (!db) {
      await connectToDatabase();
    }

    const subscribers = db.collection('subscribers');
    const subscriber = { username, chatId, email, subscribedAt: new Date() };
    await subscribers.insertOne(subscriber);
  } catch (error) {
    console.error('Error storing subscriber:', error);
    throw error;
  }
}

async function getSubscribers() {
  try {
    if (!db) {
      await connectToDatabase();
    }

    const subscribers = db.collection('subscribers');
    return await subscribers.find({}).toArray();
  } catch (error) {
    console.error('Error fetching subscribers:', error);
    throw error;
  }
}

async function isSubscriber(username) {
  try {
    if (!db) {
      await connectToDatabase();
    }

    const subscribers = db.collection('subscribers');
    const subscriber = await subscribers.findOne({ username });
    return !!subscriber;
  } catch (error) {
    console.error('Error checking subscriber:', error);
    throw error;
  }
}

async function deleteSubscriber(username) {
  try {
    if (!db) {
      await connectToDatabase();
    }

    const subscribers = db.collection('subscribers');

    // Delete the subscriber based on their username
    await subscribers.deleteOne({ username });
  } catch (error) {
    console.error('Error deleting subscriber:', error);
    throw error;
  }
}

module.exports = {
  storeSubscriber,
  getSubscribers,
  isSubscriber,
  deleteSubscriber,
};
