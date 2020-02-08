import {Type} from "ts-mongoose";
/**
 * For parsing the JSON Response
 */
export interface AnswerInterface {
    text: string,
    type: number,
    votes: number
}
