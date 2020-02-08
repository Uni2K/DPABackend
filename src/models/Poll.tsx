import {createSchema, Type, typedModel} from 'ts-mongoose';
import {PollTypes} from "../helpers/Constants";
import {AnswerInterface} from "../interfaces/AnswerInterface";

const topicModel = require('./Topic');

const pollSchema = createSchema(
    {
        enabled: Type.boolean({default: true}),
        user: Type.ref(Type.objectId()).to("Topics", topicModel),

        header: Type.string({required: true}),
        description: Type.string({required: true}),
        type: Type.number({default: PollTypes.Default}),
        typeFlags: Type.array().of({flag: Type.number({default: 0}), payload: Type.string()}), //payload for example the location, array cause many options possible

        answers: Type.array({required: true}).of({
            text: Type.string(), //The text part of the answer, could also be an URL (if image)
            type: Type.number(), //Answerype
            votes: Type.number() //How many votes this specific answer got
        }),
        expirationDate: Type.date({required: true}), //When is the poll not votable anymore
        topics: Type.array().of({topic: Type.string({required: true})}), 
        scoreOverall: Type.number({default: 0}), 
        rankOverall: Type.number({default: 0}),
        rankCategory: Type.number({default: 0}),

        flag: Type.number({default: 0}), //maybe trending, recommended, controverse, see Constants

    },
    {_id: true, timestamps: true}
);

export const pollModel = typedModel('Polls', pollSchema);

