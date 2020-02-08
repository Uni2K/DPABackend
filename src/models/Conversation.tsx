import { createSchema, Type, typedModel } from 'ts-mongoose';

/**
 * Conversation is the main part of a deep poll. Child: Comment, Parent: any deep poll.
 * 
 */
const conversationSchema = createSchema(
    {
        user: Type.string({ required: true }), //redundant
        parentPoll: Type.string({ required: true }),

        flag: Type.number({default: 0}),
        enabled:Type.boolean({default:true})
    },
    { _id: true, timestamps: true}
);



export const conversationModel = typedModel('Conversations',conversationSchema);


