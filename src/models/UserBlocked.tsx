import { createSchema, Type, typedModel } from 'ts-mongoose';

/**
 * Simple class representing a blocked user hold in an user account
 */

const userBlockedSchema = createSchema(
    {
        user: Type.string({ required: true }),
        blockeduser: Type.string({ required: true }),

        flag: Type.number({default: 0}),
        enabled:Type.boolean({default:true})
    },
    { _id: true, timestamps: true}
);



export const userBlockedModel = typedModel('UserBlocked',userBlockedSchema);


