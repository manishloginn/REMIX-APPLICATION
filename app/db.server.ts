import {  MongoClient } from 'mongodb';
import mongoose from 'mongoose';

// MongoDB connection URL
const client = new MongoClient('mongodb+srv://manish:12345@cluster0.vng14.mongodb.net/quizApp');
  

let db = null;

const getDb = async () => {
  if (!db) {
    try {
      await client.connect(); // Establish connection
      console.log("Connected to MongoDB successfully!");
      db = client.db('quizApp'); // Use your database name
    } catch (error) {
      console.error("Failed to connect to MongoDB:", error);
      throw error;
    }
  }
  return db;
};

export { getDb };



const questionSchema = new mongoose.Schema(
    {
        question: { type: String, required: true },
        options: { type: [String], required: true },
        correctAnswer: { type: String, required: true },
    },
    { collection: 'quizQuestions' } 
);


const Question = mongoose.models.quizQuestions || mongoose.model('quizQuestions', questionSchema);

export default Question;