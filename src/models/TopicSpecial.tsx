import {createSchema, Type, typedModel} from 'ts-mongoose';


const TopicSpecialSchema = createSchema(
    {
        name: Type.string({required: true}),
    },
    {_id: true, timestamps: true}
);

const TopicSpecialItemSchema = createSchema(
    {
        topicID: Type.object({required: true}),
        specialTopicID: Type.object({required: true}),
    },
    {_id: true, timestamps: true}
);

export const topicSpecialItemModel = typedModel('TopicSpecialItem', TopicSpecialItemSchema);
export const topicSpecialModel = typedModel('TopicSpecial', TopicSpecialSchema);
