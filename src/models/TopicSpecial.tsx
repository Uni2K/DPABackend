import {createSchema, Type, typedModel} from 'ts-mongoose';


const TopicSpecialSchema = createSchema(
    {
        name: Type.string({required: true, unique: true}),
    },
    {_id: true, timestamps: true}
);

const TopicSpecialItemSchema = createSchema(
    {
        topicID: Type.objectId({required: true}),
        specialTopicID: Type.objectId({required: true}),
    },
    {_id: true, timestamps: true}
);

export const topicSpecialItemModel = typedModel('TopicSpecialItem', TopicSpecialItemSchema);
export const topicSpecialModel = typedModel('TopicSpecial', TopicSpecialSchema);
