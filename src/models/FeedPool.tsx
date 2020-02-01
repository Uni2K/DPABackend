import { createSchema, Type, typedModel } from 'ts-mongoose';

const feedSchema = createSchema(
    {
        user: Type.objectId({ required: true }),
        content: Type.objectId({ required: true }),
        contentType: Type.string({required: true }),
        priority: Type.number({ required: true, default: 0 }),
        index: Type.number({ required: true}),

    },
    { _id: true, timestamps: true }
);



export const feedModel = typedModel('FeedPool', feedSchema);