"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ts_mongoose_1 = require("ts-mongoose");
/**
 * Representing a single vote made by a user -> For preventing double vote etc., statistics
 */
const PollVoteSchema = ts_mongoose_1.createSchema({
    userid: ts_mongoose_1.Type.string({ required: true }),
    pollid: ts_mongoose_1.Type.string({ required: true }),
    indexofanswer: ts_mongoose_1.Type.number({ required: true }),
    enabled: ts_mongoose_1.Type.boolean({ default: true })
}, { _id: true, timestamps: true });
exports.pollVoteModel = ts_mongoose_1.typedModel('PollVotes', PollVoteSchema);
//# sourceMappingURL=PollVote.js.map