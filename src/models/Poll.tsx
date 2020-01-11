import {createSchema, Type, typedModel} from 'ts-mongoose';
import {PollTypes} from "../helpers/Constants";

const topicModel = require('./Topic');

const pollSchema = createSchema(
    {
        enabled: Type.boolean({default: true}),
        user: Type.ref(Type.objectId()).to("Topics", topicModel),

        header: Type.string({required: true}),
        description: Type.string({required: true}),
        type: Type.number({default: PollTypes.Default}),
        typeFlags: Type.array().of({flag:Type.number({default: 0}), payload:Type.string()}),

        answers: Type.array({required: true}).of({text: Type.string(), type: Type.number(), votes: Type.number()}),
        expirationDate: Type.date({required: true}),

        scoreOverall: Type.number({default: 0}),
        rankOverall: Type.number({default: 0}),
        rankCategory: Type.number({default: 0}),

        flag: Type.number({default: 0}),

    },
    {_id: true, timestamps: true}
);

export const pollModel = typedModel('Polls', pollSchema);

