"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ts_mongoose_1 = require("ts-mongoose");
/**
 * Representing the number of Topics at a specific time for a given topic-> created by a runner -> For statistics
 */
const TopicSnapshotSchema = ts_mongoose_1.createSchema({
    topicID: ts_mongoose_1.Type.string({ required: true }),
    pollCount: ts_mongoose_1.Type.number({ required: true }),
    enabled: ts_mongoose_1.Type.boolean({ default: true })
}, { _id: false, timestamps: true });
exports.topicSnapshotModel = ts_mongoose_1.typedModel('TopicSnapshots', TopicSnapshotSchema);
//# sourceMappingURL=TopicSnapshot.js.map