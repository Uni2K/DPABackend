"use strict";
const ts_mongoose_1 = require("ts-mongoose");
const topicScheme = ts_mongoose_1.createSchema({
    _id: ts_mongoose_1.Type.string({ required: true }),
    name: ts_mongoose_1.Type.string({ required: true }),
    parent: ts_mongoose_1.Type.string({ required: true }),
    baseColor: ts_mongoose_1.Type.string({ required: false }),
    iconURL: ts_mongoose_1.Type.string({ required: false })
}, { _id: false, timestamps: false });
const Topic = ts_mongoose_1.typedModel('Topics', topicScheme);
module.exports = Topic;
//# sourceMappingURL=Tag.js.map