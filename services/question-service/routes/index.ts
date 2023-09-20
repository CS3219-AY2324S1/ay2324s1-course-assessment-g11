import "dotenv/config";
import express from 'express';
import sanitizeHtml from 'sanitize-html';
import { MongoClient, ServerApiVersion } from 'mongodb';
import { NewQuestion } from '../models/new_question.model';

export const router = express.Router();


const uri = process.env.MONGO_ATLAS_URL || 'mongodb://localhost:27017';

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const mongoClient = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await mongoClient.connect();
    // Send a ping to confirm a successful connection
    await mongoClient.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    await mongoClient.close();
  }
}


/* For debugging. */
router.get('/', function(req, res, next) {
  run().catch(console.dir);
  res.send('question-service');
});

router.post('/question', async (req: express.Request<{}, {}, NewQuestion>, res, next) => {
  req.body.content = sanitizeHtml(req.body.content);
  if (req.body.title.length > 200) {
    res.status(400).send("Title too long");
    return;
  }
  if (req.body.difficulty !== "easy" && req.body.difficulty !== "medium" && req.body.difficulty !== "hard") {
    res.status(400).send("Invalid difficulty");
    return;
  }
  // Connect to question db
  try {
    await mongoClient.connect();
    let db = mongoClient.db("question_db");
    let collection = db.collection("questions");
    // Find question with same title
    let same_title_qn = await collection.findOne({title: req.body.title});
    if (same_title_qn) {
      res.status(400).send("Question with same title already exists: " + same_title_qn._id);
      return;
    }
    let result = await collection.insertOne(req.body);
    if (!result.acknowledged) {
      res.status(500).send("Failed to insert question");
      return;
    }
    res.status(201).send(result.insertedId);
  } finally {
    await mongoClient.close();
  }
});

