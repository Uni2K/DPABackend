import { createSchema, Type, typedModel } from 'ts-mongoose';


const conversationSchema = createSchema(
    {
        user: Type.string({ required: true }),
        parentPoll: Type.string({ required: true }),

        flag: Type.number({default: 0}),
        enabled:Type.boolean({default:true})
    },
    { _id: true, timestamps: true}
);



export const conversationModel = typedModel('Conversations',conversationSchema);


