"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ts_mongoose_1 = require("ts-mongoose");
const UserSnapshotSchema = ts_mongoose_1.createSchema({
    user: ts_mongoose_1.Type.string({ required: true }),
    reputationCount: ts_mongoose_1.Type.number({ required: false, default: 0 }),
    enabled: ts_mongoose_1.Type.boolean({ default: true })
}, { _id: false, timestamps: true });
exports.userSnapshotModel = ts_mongoose_1.typedModel('UserSnapshots', UserSnapshotSchema);
//# sourceMappingURL=UserSnapshot.js.map