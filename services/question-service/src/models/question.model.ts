import { Document, ObjectId, WithId } from "mongodb";
import { NewQuestion } from "./new_question.model";
export interface Question extends NewQuestion, Document {
    _id?: ObjectId;
    dateCreated: Date;
    author: string;
};
