require("dotenv").config();

const { MongoClient } = require("mongodb");

const client = new MongoClient(process.env.MONGO_URL);

const dbName = "project";

async function connectDB() {
  try {
    console.log("Connecting...");

    await client.connect();

    console.log("MongoDB connected successfully");

    const db = client.db(dbName);

    const collection = db.collection("users");

    const findResult = await collection.find({}).toArray();

    console.log("findResult:", findResult);

    return db;
  } catch (error) {
    console.error("MongoDB connection error:", error);
  }
}

module.exports = connectDB;

connectDB();
