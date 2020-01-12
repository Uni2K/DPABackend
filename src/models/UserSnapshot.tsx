import {createSchema, Type, typedModel} from 'ts-mongoose';


const UserSnapshotSchema = createSchema(
    {
        user: Type.string({required: true}),
        reputationCount: Type.number({required: false, default: 0}),

        enabled: Type.boolean({default: true})
    },
    {_id: false, timestamps: true}
);

export const userSnapshotModel = typedModel('UserSnapshots', UserSnapshotSchema);


