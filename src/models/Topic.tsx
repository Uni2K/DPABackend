import { createSchema, Type, typedModel } from 'ts-mongoose';


const topicSchema = createSchema(
    {
        _id: Type.string({ required: true }),
        name: Type.string({ required: true }),
        parent: Type.string({ required: true }),
        baseColor: Type.string({ required: false }),
        iconURL: Type.string({ required: false , default: ""}),
        description: Type.string({ required: false , default: ""}),
        flag: Type.number({default: 0}),
        enabled:Type.boolean({default:true}),
        scoreOverall: Type.number({default: 0}),
    },
    { _id: false, timestamps: false }
);



export const topicModel = typedModel('Topics', topicSchema);


