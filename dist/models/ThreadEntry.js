"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ts_mongoose_1 = require("ts-mongoose");
/**
 * Specific entry inside a thread
 */
const threadEntrySchema = ts_mongoose_1.createSchema({
    user: ts_mongoose_1.Type.string({ required: true }),
    thread: ts_mongoose_1.Type.string({ required: true }),
    pollID: ts_mongoose_1.Type.objectId({ required: true }),
    flag: ts_mongoose_1.Type.number({ default: 0 }),
    enabled: ts_mongoose_1.Type.boolean({ default: true })
}, { _id: true, timestamps: true });
exports.threadEntryModel = ts_mongoose_1.typedModel('ThreadEntries', threadEntrySchema);
//# sourceMappingURL=ThreadEntry.js.map