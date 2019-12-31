"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ts_mongoose_1 = require("ts-mongoose");
const topicSchema = ts_mongoose_1.createSchema({
    _id: ts_mongoose_1.Type.string({ required: true }),
    name: ts_mongoose_1.Type.string({ required: true }),
    parent: ts_mongoose_1.Type.string({ required: true }),
    baseColor: ts_mongoose_1.Type.string({ required: false }),
    iconURL: ts_mongoose_1.Type.string({ required: false })
}, { _id: false, timestamps: false });
exports.topicModel = ts_mongoose_1.typedModel('Topics', topicSchema);
//# sourceMappingURL=Topic.js.map