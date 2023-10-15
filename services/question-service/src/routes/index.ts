import "dotenv/config";
import util from "util";
import express from "express";
import sanitizeHtml from "sanitize-html";
import { MongoClient, ObjectId, ServerApiVersion } from "mongodb";
import { NewQuestion, isDifficulty } from "../models/new_question.model";
import { Question } from "../models/question.model";
import { kebabToProperCase } from "./utils";

export const router = express.Router();

const uri = process.env.MONGO_ATLAS_URL || "mongodb://localhost:27017";

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const mongoClient = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await mongoClient.connect();
    // Send a ping to confirm a successful connection
    await mongoClient.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    await mongoClient.close();
  }
}

/* For debugging. */
router.get("/", function (req, res, next) {
  run().catch(console.dir);
  res.send("question-service");
});

function validateNewQuestion(reqBody: any): reqBody is NewQuestion {
  return reqBody.title && reqBody.content && isDifficulty(reqBody.difficulty);
}

/**
 * Create a new question.
 */
router.post("/question", async (req, res, next) => {
  /**
   * #swagger.description = 'Create a new question.'
   * #swagger.parameters['title'] = { description: 'Title of the question.', type: 'string' }
   * #swagger.parameters['content'] = { description: 'Content of the question.', type: 'string' }
   * #swagger.parameters['topics'] = { description: 'Array of topics of the question.', type: 'array' }
   * #swagger.parameters['difficulty'] = { description: 'Difficulty of the question.', type: 'string' }
   * #swagger.parameters['testCasesInputs'] = { description: 'Array of test case inputs.', type: 'array' }
   * #swagger.parameters['testCasesOutputs'] = { description: 'Array of test case outputs.', type: 'array' }
   * #swagger.parameters['defaultCode'] = { description: 'Object of default code for each language.', type: 'object' }
   * #swagger.parameters['solution'] = { description: 'Object of solution code for each language.', type: 'object' }
   */
  const reqBody = req.body as NewQuestion;
  if (!validateNewQuestion(reqBody)) {
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
    let same_title_qn = await collection.findOne({ title: req.body.title });
    if (same_title_qn) {
      res
        .status(400)
        .send("Question with same title already exists: " + same_title_qn._id);
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
  } catch (err) {
    console.log(
      util.inspect(err, { showHidden: false, depth: null, colors: true })
    );
    res.status(500).send("Failed to insert question");
  } finally {
    await mongoClient.close();
  }
});

/**
 * Get questions based on topics or difficulty, with offset based pagination.
 */
router.get("/list", async (req, res, next) => {
  /**
   * #swagger.description = 'Get questions based on topics or difficulty, with offset based pagination.'
   * #swagger.parameters['topics'] = { description: 'Array of topics to filter by.', type: 'array' }
   * #swagger.parameters['difficulty'] = { description: 'Array of difficulties to filter by.', type: 'array' }
   * #swagger.parameters['searchTitle'] = { description: 'Search for questions with titles containing this string.', type: 'string' }
   * #swagger.parameters['limit'] = { description: 'Number of questions to return per page.', type: 'number' }
   * #swagger.parameters['page'] = { description: 'Page number to return.', type: 'number' }
   * #swagger.parameters['sort'] = { description: 'Sort object. Example: {title: 1} sorts by title in ascending order.', type: 'object' }
   */
  let searchObj: any = {};
  if (req.body.topics && req.body.topics.length > 0) {
    searchObj.topics = { $elemMatch: { $in: req.body.topics } };
  }
  if (req.body.difficulty && req.body.difficulty.length > 0) {
    for (let difficulty of req.body.difficulty) {
      if (!isDifficulty(difficulty)) {
        res.status(400).send("Invalid difficulty");
        return;
      }
    }
    searchObj.difficulty = { $in: req.body.difficulty };
  }
  if (req.body.searchTitle) {
    // TODO: Implement atlas search
    // searchObj.title = { "$regex": req.body.searchTitle, "$options": "i"};
  }
  const limit = req.body.limit ?? 10;
  const page = req.body.page ?? 1;
  const sortObj = req.body.sort ?? { title: 1 };
  try {
    await mongoClient.connect();
    let db = mongoClient.db("question_db");
    let collection = db.collection<Question>("questions");
    let result = await collection
      .find(searchObj)
      .sort(sortObj)
      .limit(limit + 1)
      .skip((page - 1) * limit)
      .toArray();
    let hasNextPage = result.length === limit + 1;
    if (hasNextPage) {
      result = result.slice(0, limit);
    }
    let responseObj: any = { questions: result };
    responseObj["hasNextPage"] = hasNextPage;
    res.status(200).send(responseObj);
  } catch (err) {
    console.log(
      util.inspect(err, { showHidden: false, depth: null, colors: true })
    );
    res.status(500).send("Failed to get questions");
  } finally {
    await mongoClient.close();
  }
});

router.get("/question/:name", async (req, res, next) => {
  try {
    await mongoClient.connect();
    let db = mongoClient.db("question_db");
    let collection = db.collection<Question>("questions");
    let result = await collection.findOne({
      title: kebabToProperCase(req.params.name as string),
    });
    if (!result) {
      res.status(404).send("Question not found");
      return;
    }
    res.status(200).send(result);
  } catch (err) {
    console.log(
      util.inspect(err, { showHidden: false, depth: null, colors: true })
    );
    res.status(500).send("Failed to get question");
  } finally {
    await mongoClient.close();
  }
});

router.put("/question/:id", async (req, res, next) => {
  // Validate request body
  /**
   * #swagger.description = 'Update a question.'
   * #swagger.parameters['title'] = { description: 'Title of the question.', type: 'string' }
   * #swagger.parameters['content'] = { description: 'Content of the question.', type: 'string' }
   * #swagger.parameters['topics'] = { description: 'Array of topics of the question.', type: 'array' }
   * #swagger.parameters['difficulty'] = { description: 'Difficulty of the question.', type: 'string' }
   * #swagger.parameters['testCasesInputs'] = { description: 'Array of test case inputs.', type: 'array', items: { type: 'string' } }
   * #swagger.parameters['testCasesOutputs'] = { description: 'Array of test case outputs.', type: 'array', items: { type: 'string' } }
   * #swagger.parameters['defaultCode'] = { description: 'Object of default code for each language.', type: 'object' }
   * #swagger.parameters['solution'] = { description: 'Object of solution code for each language.', type: 'object' }
   */
  if (req.body.title && req.body.title.length > 200) {
    res.status(400).send("Title too long");
    return;
  }
  if (req.body.content) {
    req.body.content = sanitizeHtml(req.body.content);
  }
  if (req.body.difficulty && !isDifficulty(req.body.difficulty)) {
    res.status(400).send("Invalid difficulty");
    return;
  }
  // Connect to question db
  try {
    await mongoClient.connect();
    let db = mongoClient.db("question_db");
    let collection = db.collection("questions");
    // Find question with same title
    let same_title_qn = await collection.findOne({ title: req.body.title });
    if (same_title_qn && same_title_qn._id.toString() !== req.params.id) {
      res
        .status(400)
        .send("Question with same title already exists: " + same_title_qn._id);
      return;
    }
    let result = await collection.updateOne(
      { _id: new ObjectId(req.params.id) },
      {
        $set: {
          ...req.body,
          dateUpdated: new Date(),
        },
      }
    );
    if (!result.acknowledged) {
      res.status(500).send("Failed to update question");
      return;
    }
    res.status(200).send("Updated question");
  } catch (err) {
    console.log(
      util.inspect(err, { showHidden: false, depth: null, colors: true })
    );
    res.status(500).send("Failed to update question");
  } finally {
    await mongoClient.close();
  }
});

router.delete("/question/:id", async (req, res, next) => {
  try {
    await mongoClient.connect();
    let db = mongoClient.db("question_db");
    let collection = db.collection("questions");
    let result = await collection.deleteOne({
      _id: new ObjectId(req.params.id),
    });
    if (!result.acknowledged) {
      res.status(500).send("Failed to delete question");
      return;
    }
    if (result.deletedCount === 0) {
      res.status(404).send("Question not found");
      return;
    }
    res.status(200).send("Deleted question");
  } catch (err) {
    console.log(
      util.inspect(err, { showHidden: false, depth: null, colors: true })
    );
    res.status(500).send("Failed to delete question");
  } finally {
    await mongoClient.close();
  }
});

router.post("/random-question", async (req, res, next) => {
  /**
   * #swagger.description = 'Get a random question.'
   * #swagger.parameters['difficulty'] = { description: 'Difficulty of the question.', type: 'string' }
   * #swagger.parameters['topics'] = { description: 'Array of topics of the question to choose.', type: 'array' }
   */
  if (!isDifficulty(req.body.difficulty)) {
    res.status(400).send("Invalid difficulty");
    return;
  }
  let difficulty = req.body.difficulty;
  let topics = req.body.topics ?? [];
  try {
    await mongoClient.connect();
    let db = mongoClient.db("question_db");
    let collection = db.collection<Question>("questions");
    // Find random question filtered by difficulty and topics
    let matchSearchObj: any = { difficulty: difficulty };
    if (topics.length > 0) {
      matchSearchObj.topics = { $elemMatch: { $in: topics } };
    }
    let result = await collection
      .aggregate([{ $match: matchSearchObj }, { $sample: { size: 1 } }])
      .toArray();
    if (!result) {
      res.status(404).send("Question not found");
      return;
    }
    res.status(200).send(result);
  } catch (err) {
    console.log(
      util.inspect(err, { showHidden: false, depth: null, colors: true })
    );
    res.status(500).send("Failed to get random question");
  } finally {
    await mongoClient.close();
  }
});
