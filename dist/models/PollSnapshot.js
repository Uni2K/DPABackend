"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ts_mongoose_1 = require("ts-mongoose");
/**
 * Representing the number of votes at a specific time for a given poll id -> created by a runner -> For statistics
 */
const PollSnapshotSchema = ts_mongoose_1.createSchema({
    pollid: ts_mongoose_1.Type.string({ required: true }),
    answers: ts_mongoose_1.Type.array({ required: true }).of({ text: ts_mongoose_1.Type.string(), type: ts_mongoose_1.Type.number(), votes: ts_mongoose_1.Type.number() }),
    enabled: ts_mongoose_1.Type.boolean({ default: true })
}, { _id: true, timestamps: true });
exports.pollSnapshotModel = ts_mongoose_1.typedModel('PollSnapshots', PollSnapshotSchema);
//# sourceMappingURL=PollSnapshot.js.map