"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ts_mongoose_1 = require("ts-mongoose");
/**
 * Representing a report on either a user or a poll
 */
const reportSchema = ts_mongoose_1.createSchema({
    user: ts_mongoose_1.Type.string({ required: true }),
    reason: ts_mongoose_1.Type.string({ required: true }),
    target: ts_mongoose_1.Type.string({ required: true }),
    enabled: ts_mongoose_1.Type.boolean({ default: true })
}, { _id: true, timestamps: true });
exports.reportModel = ts_mongoose_1.typedModel('Reports', reportSchema);
//# sourceMappingURL=Report.js.map