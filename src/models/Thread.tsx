import { createSchema, Type, typedModel } from 'ts-mongoose';

/**
 * Threads are used to concat a number of polls
 */

const threadSchema = createSchema(
    {
        user: Type.string({ required: true }),
        parentPoll: Type.string({ required: true }),

        flag: Type.number({default: 0}),
        enabled:Type.boolean({default:true})
    },
    { _id: true, timestamps: true}
);



export const threadModel = typedModel('Threads',threadSchema);


