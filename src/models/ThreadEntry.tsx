import { createSchema, Type, typedModel } from 'ts-mongoose';

/**
 * Specific entry inside a thread
 */

const threadEntrySchema = createSchema(
    {
        user: Type.string({ required: true }), //User making this entry
        thread: Type.string({ required: true }),
        pollID: Type.objectId({ required: true }), //Representing the poll inside this thread

        flag: Type.number({default: 0}),
        enabled:Type.boolean({default:true})
    },
    { _id: true, timestamps: true}
);



export const threadEntryModel = typedModel('ThreadEntries',threadEntrySchema);


