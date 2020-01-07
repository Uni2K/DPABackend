import { createSchema, Type, typedModel } from 'ts-mongoose';

/**
 *
 */
const conversationParticipantSchema = createSchema(
    {
        user: Type.string({ required: true }),
        conversation: Type.string({ required: true }),
        flag: Type.number({default: 0}),
        enabled:Type.boolean({default:true})
    },
    { _id: true, timestamps: true}
);



export const conversationParticipantModel = typedModel('ConversationParticipants',conversationParticipantSchema);


