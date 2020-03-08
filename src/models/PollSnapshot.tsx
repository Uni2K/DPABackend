import {createSchema, Type, typedModel} from 'ts-mongoose';

/**
 * Representing the number of votes at a specific time for a given poll id -> created by a runner -> For statistics
 */
const PollSnapshotSchema = createSchema(
    {
        pollID: Type.string({required: true}),
        answers: Type.array({required: true}).of({text: Type.string(), type: Type.number(), votes: Type.number()}),
        enabled: Type.boolean({default: true})
    },
    {_id: true, timestamps: true}
);

export const pollSnapshotModel = typedModel('PollSnapshots', PollSnapshotSchema);


