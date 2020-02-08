import {AnswerInterface} from "../interfaces/AnswerInterface";


/**
 *  Simple Helperclass to parse String content into objects
 *  String could be either jsons or custom schemas like  string='content1 //// content2', where //// is an delimiter
 * Json is clearly prefered
 */
export async function parseAnswers(input:Array<string>):Promise<Array<AnswerInterface>> {

    let arr=[]
    for(let answer of input){
        const a:AnswerInterface= JSON.parse(answer)
        arr.push(a)
    }

    return arr
}

