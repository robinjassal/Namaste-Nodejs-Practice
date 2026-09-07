require("dotenv").config();

console.log("MONGO_URL:", process.env.MONGO_URL);

const { MongoClient } = require("mongodb");

const client = new MongoClient(process.env.MONGO_URL);

const dbName = "project";

async function connectDB() {
  try {
    console.log("Connecting to MongoDB...");

    await client.connect();

    console.log("MongoDB connected successfully");

    const db = client.db(dbName);

    const collection = db.collection("users");

    const data = {
      name: "Omkar",
      hobby: "Bowling",
      hometown: "Jalandar",
    };
    await collection.insertOne(data);
    const findResult = await collection.find({}).toArray();

    console.log("findResult:", findResult);

    return db;
  } catch (error) {
    console.log("MongoDB connection error:", error);
  }
}

module.exports = connectDB;

connectDB();
