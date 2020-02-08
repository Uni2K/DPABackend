import { createSchema, Type, typedModel } from 'ts-mongoose';

/**
 * Comment is the child of a conversation, displays a message inside a e.g deep poll conversatin
 */

const commentSchema = createSchema(
    {
        user: Type.string({ required: true }),
        parentComment: Type.string({ required: true }), //Maybe this is a subcomment? 
        conversation: Type.string({ required: true }), //Parent Conversation

        header: Type.string({ required: true }), // So a comment can consist of a header and the content
        content: Type.string({ required: true }),

        flag: Type.number({default: 0}),
        enabled:Type.boolean({default:true})
    },
    { _id: true, timestamps: true}
);



export const commentModel = typedModel('Comment',commentSchema);


