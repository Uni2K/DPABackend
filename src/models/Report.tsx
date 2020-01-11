import { createSchema, Type, typedModel } from 'ts-mongoose';

/**
 * Representing a report on either a user or a poll
 */
const reportSchema = createSchema(
    {
        user: Type.string({ required: true }),
        reason: Type.string({ required: true }),
        target: Type.string({ required: true }),

        enabled:Type.boolean({default:true})
    },
    { _id: true, timestamps: true}
);



export const reportModel = typedModel('Reports',reportSchema);


