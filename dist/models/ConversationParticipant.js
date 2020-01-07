"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ts_mongoose_1 = require("ts-mongoose");
/**
 *
 */
const conversationParticipantSchema = ts_mongoose_1.createSchema({
    user: ts_mongoose_1.Type.string({ required: true }),
    conversation: ts_mongoose_1.Type.string({ required: true }),
    flag: ts_mongoose_1.Type.number({ default: 0 }),
    enabled: ts_mongoose_1.Type.boolean({ default: true })
}, { _id: true, timestamps: true });
exports.conversationParticipantModel = ts_mongoose_1.typedModel('ConversationParticipants', conversationParticipantSchema);
//# sourceMappingURL=ConversationParticipant.js.map