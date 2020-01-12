"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ts_mongoose_1 = require("ts-mongoose");
/**
 * Representing an image uploaded by the user
 */
const imageSchema = ts_mongoose_1.createSchema({
    user: ts_mongoose_1.Type.string({ required: true }),
    fileName: ts_mongoose_1.Type.string({ required: true }),
    purpose: ts_mongoose_1.Type.number({ default: 0 }),
    flag: ts_mongoose_1.Type.number({ default: 0 }),
    enabled: ts_mongoose_1.Type.boolean({ default: true })
}, { _id: true, timestamps: true });
exports.imageModel = ts_mongoose_1.typedModel('Images', imageSchema);
//# sourceMappingURL=Image.js.map