import { MongoClient } from 'mongodb';

// MongoDB connection URL
const client = new MongoClient('mongodb+srv://manish:12345@cluster0.vng14.mongodb.net/quizApp');

let db = null;

const getDb = async () => {
  if (!db) {
    try {
      await client.connect();
      console.log("Connected to MongoDB successfully!");
      db = client.db('quizApp'); // Database name
      console.log('hit')
    } catch (error) {
    //   console.error("Failed to connect to MongoDB:", error);
    //   throw error;
    console.log('errer')
    }
  }
  return db;
};

export { getDb };
