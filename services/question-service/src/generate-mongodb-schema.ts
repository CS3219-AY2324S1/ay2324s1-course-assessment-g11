import "dotenv/config";
import { MongoClient, ServerApiVersion } from 'mongodb';
import { exit } from "process";

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

    const db = await mongoClient.connect().then(client => client.db("question_db"));

    db.command( { collMod: "questions",
    validator: {
        $jsonSchema: {
            bsonType: "object",
            required: [ "topics", "difficulty", "title", "content", "testCaseInputs", "testCaseOutputs", "defaultCode", "dateCreated", "dateUpdated" ],
            properties: {
                topics: {
                bsonType: "array",
                description: "must be an array of strings and is required",
                items: {
                    bsonType: "string"
                }
                },
                difficulty: {
                enum: [ "easy", "medium", "hard" ],
                description: "must be a string and is required"
                },
                title: {
                bsonType: "string",
                description: "must be a string and is required"
                },
                content: {
                bsonType: "string",
                description: "must be a string and is required"
                },
                testCaseInputs: {
                bsonType: "array",
                description: "must be an array of strings and is required",
                items: {
                    bsonType: "string"
                }
                },
                testCaseOutputs: {
                bsonType: "array",
                description: "must be an array of strings and is required",
                items: {
                    bsonType: "string"
                }
                },
                defaultCode: {
                bsonType: "object",
                description: "must be a object and is required",
                properties: {
                    java: {
                        bsonType: "string"
                    },
                    cpp: {
                        bsonType: "string"
                    },
                    python: {
                        bsonType: "string"
                    }
                }
                },
                solution: {
                bsonType: "object",
                description: "must be a object",
                properties: {
                    java: {
                        bsonType: "string"
                    },
                    cpp: {
                        bsonType: "string"
                    },
                    python: {
                        bsonType: "string"
                    }
                }
                },
                dateCreated: {
                bsonType: "date",
                description: "must be a date and is required"
                },
                dateUpdated: {
                bsonType: "date",
                description: "must be a date and is required"
                },
                author: {
                bsonType: "string"
                }
            }
        }
    },
    validationLevel: "strict",
    } ).then((result) => {
        console.log(result);
        exit(0);
    }).catch((err) => {
        console.log(err);
        exit(1);
    });
}

run().catch(console.dir);
