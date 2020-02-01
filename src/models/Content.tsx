import { createSchema, Type, typedModel } from 'ts-mongoose';

const contentSchema = createSchema(
    {
        user: Type.objectId({ required: true }),
        content: Type.objectId({ required: true }),
        contentType: Type.string({required: true }),
        priority: Type.number({ required: true, default: 0 })

    },
    { _id: true, timestamps: true }
);

export const contentModel = typedModel('ContentPool', contentSchema);