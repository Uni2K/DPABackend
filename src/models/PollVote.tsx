import {createSchema, Type, typedModel} from 'ts-mongoose';

/**
 * Representing a single vote made by a user -> For preventing double vote etc., statistics
 */
const PollVoteSchema = createSchema(
    {
        userid: Type.string({required: true}),
        pollid: Type.string({required: true}),
        indexofanswer: Type.number({required: true}),
        enabled: Type.boolean({default: true})
    },
    {_id: true, timestamps: true}
);

export const pollVoteModel = typedModel('PollVotes', PollVoteSchema);


