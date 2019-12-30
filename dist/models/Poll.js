"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ts_mongoose_1 = require("ts-mongoose");
const topicModel = require('./Topic');
const pollSchema = ts_mongoose_1.createSchema({
    enabled: ts_mongoose_1.Type.boolean({ default: true }),
    user: ts_mongoose_1.Type.ref(ts_mongoose_1.Type.objectId()).to("Topics", topicModel),
    header: ts_mongoose_1.Type.string({ required: true }),
    description: ts_mongoose_1.Type.string({ required: true }),
    type: ts_mongoose_1.Type.number({ required: true, default: 0 }),
    answers: ts_mongoose_1.Type.array({ required: true }).of({ text: ts_mongoose_1.Type.string(), type: ts_mongoose_1.Type.number(), votes: ts_mongoose_1.Type.number() }),
    expirationDate: ts_mongoose_1.Type.date({ required: true }),
    scoreOverall: ts_mongoose_1.Type.number({ default: 0 }),
    rankOverall: ts_mongoose_1.Type.number({ default: 0 }),
    rankCategory: ts_mongoose_1.Type.number({ default: 0 }),
    flag: ts_mongoose_1.Type.number({ default: 0 }),
}, { _id: true, timestamps: true });
exports.Poll = ts_mongoose_1.typedModel('Polls', pollSchema);
//# sourceMappingURL=Poll.js.map