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

function validateNewQuestion(reqBody: any): reqBody is NewQuestion {
  return reqBody.title && reqBody.content && ["easy", "medium", "hard"].includes(reqBody.difficulty);
}

router.post('/question', async (req, res, next) => {
  // Validate request body
  if (!validateNewQuestion(req.body)) {
    res.status(400).send("Invalid question");
    return;
  }
  if (req.body.title.length > 200) {
    res.status(400).send("Title too long");
    return;
  }
  req.body.content = sanitizeHtml(req.body.content);
  req.body.topics = req.body.topics ?? [];
  req.body.testCasesInputs = req.body.testCasesInputs ?? [];
  req.body.testCasesOutputs = req.body.testCasesOutputs ?? [];
  req.body.defaultCode = req.body.defaultCode ?? {};
  req.body.solution = req.body.solution ?? {};
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
    let result = await collection.insertOne({
      ...req.body,
      dateCreated: new Date(),
      dateUpdated: new Date(),
      topics: req.body.topics ?? [],
      testCasesInputs: req.body.testCasesInputs ?? [],
      testCasesOutputs: req.body.testCasesOutputs ?? [],
      defaultCode: req.body.defaultCode ?? {},
      solution: req.body.solution ?? {},
    });
    if (!result.acknowledged) {
      res.status(500).send("Failed to insert question");
      return;
    }
    res.status(201).send(result.insertedId);
  } finally {
    await mongoClient.close();
  }
});

router.get("/questions", async (req, res, next) => {
  let searchObj: any = {};
  if (req.body.topics && req.body.topics.length > 0) {
    searchObj.topics = {"$elemMatch": { "$in": req.body.topics}};
  }
  if (req.body.difficulty && req.body.difficulty.length > 0) {
    searchObj.difficulty = { "$in": req.body.difficulty};
  }
  if (req.body.searchTitle) {
    // TODO: Implement atlas search
    // searchObj.title = { "$regex": req.body.searchTitle, "$options": "i"};
  }
  const limit = req.body.limit ?? 10;
  const page = req.body.page ?? 1;
  const sortObj = req.body.sort ?? {title: 1};
  try {
    await mongoClient.connect();
    let db = mongoClient.db("question_db");
    let collection = db.collection("questions");
    console.log(searchObj)
    console.log(limit)
    console.log(page)
    let result = await collection.find(searchObj).sort(sortObj).limit(limit+1).skip((page-1)*limit).toArray();
    console.log(result)
    let hasNextPage = result.length === limit + 1;
    if (hasNextPage) {
      result = result.slice(0, limit);
    }
    let responseObj: any = { questions: result };
    responseObj["hasNextPage"] = hasNextPage;
    res.status(200).send(responseObj);
  } finally {
    await mongoClient.close();
  }
});
