import {createSchema, Type, typedModel} from "ts-mongoose";

const subscriptionSchema = createSchema(
    {user: Type.objectId({ required: true }),
    content: Type.string({required: true}),
    type: Type.string()},
    {_id: true, timestamps: true}
);

subscriptionSchema.index({"user": 1, "content":1, "type": 1}, {"unique": true});

export const subscriptionModel = typedModel('Subscription', subscriptionSchema)
