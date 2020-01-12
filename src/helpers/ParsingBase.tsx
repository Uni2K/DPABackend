import {AnswerInterface} from "../interfaces/AnswerInterface";

export async function parseAnswers(input:Array<string>):Promise<Array<AnswerInterface>> {

    let arr=[]
    for(let answer of input){
        const a:AnswerInterface= JSON.parse(answer)
        arr.push(a)
    }

    return arr
}

