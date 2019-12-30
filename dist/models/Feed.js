"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ts_mongoose_1 = require("ts-mongoose");
const feedSchema = ts_mongoose_1.createSchema({
    user: ts_mongoose_1.Type.objectId({ required: true, unique: true }),
    index: ts_mongoose_1.Type.number({ required: true, default: 0 }),
    content: ts_mongoose_1.Type.array().of(ts_mongoose_1.Type.number())
}, { _id: false, timestamps: false });
exports.Feeds = ts_mongoose_1.typedModel('Feeds', feedSchema);
//# sourceMappingURL=Feed.js.map