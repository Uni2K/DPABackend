import {createSchema, Type, typedModel} from 'ts-mongoose';


const UserSnapshotSchema = createSchema(
    {
        user: Type.string({required: true}),
        reputationCount: Type.number({required: false, default: 0}),
        enabled: Type.boolean({default: true})
    },
    {_id: true, timestamps: false}
);

export const userSnapshotModel = typedModel('UserSnapshots', UserSnapshotSchema);


