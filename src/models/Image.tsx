import {createSchema, Type, typedModel} from 'ts-mongoose';

/**
 * Representing an image uploaded by the user
 */

const imageSchema = createSchema(
    {
        user: Type.string({required: true}),
        fileName: Type.string({required: true}),
        purpose: Type.number({default: 0}),

        flag: Type.number({default: 0}),
        enabled: Type.boolean({default: true})
    },
    {_id: true, timestamps: true}
);

export const imageModel = typedModel('Images', imageSchema);


