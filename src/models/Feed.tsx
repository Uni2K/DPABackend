import { createSchema, Type, typedModel } from 'ts-mongoose';


const feedSchema = createSchema(
    {
        user: Type.objectId({ required: true , unique: true}),
        index: Type.number({ required: true, default:0 }),
        content:Type.array().of(Type.number())
    },
    { _id: false, timestamps: false }
);



export const Feeds = typedModel('Feeds', feedSchema);


