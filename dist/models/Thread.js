"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ts_mongoose_1 = require("ts-mongoose");
/**
 * Threads are used to concat a number of polls
 */
const threadSchema = ts_mongoose_1.createSchema({
    user: ts_mongoose_1.Type.string({ required: true }),
    parentPoll: ts_mongoose_1.Type.string({ required: true }),
    flag: ts_mongoose_1.Type.number({ default: 0 }),
    enabled: ts_mongoose_1.Type.boolean({ default: true })
}, { _id: true, timestamps: true });
exports.threadModel = ts_mongoose_1.typedModel('Threads', threadSchema);
//# sourceMappingURL=Thread.js.map