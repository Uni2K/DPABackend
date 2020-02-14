"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ts_mongoose_1 = require("ts-mongoose");
/**
<<<<<<< HEAD
 * Comment is the child of a conversation, displays a message inside a e.g deep poll conversatin
=======
 * Comment is the child of a conversation, displays a message inside a e.g deep poll conversation
>>>>>>> 2cb424ed4150fb43cac718f5f27d5dc5d97074bc
 */
const commentSchema = ts_mongoose_1.createSchema({
    user: ts_mongoose_1.Type.string({ required: true }),
    parentComment: ts_mongoose_1.Type.string({ required: true }),
    conversation: ts_mongoose_1.Type.string({ required: true }),
    header: ts_mongoose_1.Type.string({ required: true }),
    content: ts_mongoose_1.Type.string({ required: true }),
    flag: ts_mongoose_1.Type.number({ default: 0 }),
    enabled: ts_mongoose_1.Type.boolean({ default: true })
}, { _id: true, timestamps: true });
exports.commentModel = ts_mongoose_1.typedModel('Comment', commentSchema);
//# sourceMappingURL=Comment.js.map