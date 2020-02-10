import {createSchema, Type, typedModel} from 'ts-mongoose';

/**
 * Representing the number of Topics at a specific time for a given topic-> created by a runner -> For statistics
 */
const TopicSnapshotSchema = createSchema(
    {
        topicID: Type.string({required: true}),
        pollCount: Type.number({required: true}),
        enabled: Type.boolean({default: true})
    },
    {_id: false, timestamps: true}
);

export const topicSnapshotModel = typedModel('TopicSnapshots', TopicSnapshotSchema);


