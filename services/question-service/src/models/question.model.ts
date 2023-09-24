import { NewQuestion } from "./new_question.model";
export interface Question extends NewQuestion {
    _id: string;
    dateCreated: Date;
    author: string;
};
