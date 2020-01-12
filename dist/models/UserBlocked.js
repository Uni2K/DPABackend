"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ts_mongoose_1 = require("ts-mongoose");
/**
 * Simple class representing a blocked user hold in an user account
 */
const userBlockedSchema = ts_mongoose_1.createSchema({
    user: ts_mongoose_1.Type.string({ required: true }),
    blockeduser: ts_mongoose_1.Type.string({ required: true }),
    flag: ts_mongoose_1.Type.number({ default: 0 }),
    enabled: ts_mongoose_1.Type.boolean({ default: true })
}, { _id: true, timestamps: true });
exports.userBlockedModel = ts_mongoose_1.typedModel('UserBlocked', userBlockedSchema);
//# sourceMappingURL=UserBlocked.js.map