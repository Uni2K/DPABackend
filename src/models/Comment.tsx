import { createSchema, Type, typedModel } from 'ts-mongoose';



const commentSchema = createSchema(
    {
        user: Type.string({ required: true }),
        parentComment: Type.string({ required: true }),
        conversation: Type.string({ required: true }),

        header: Type.string({ required: true }),
        content: Type.string({ required: true }),

        flag: Type.number({default: 0}),
        enabled:Type.boolean({default:true})
    },
    { _id: true, timestamps: true}
);



export const commentModel = typedModel('Comment',commentSchema);


