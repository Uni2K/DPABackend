"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ts_mongoose_1 = require("ts-mongoose");
const Constants_1 = require("../helpers/Constants");
const topicModel = require('./Topic');
const pollSchema = ts_mongoose_1.createSchema({
    enabled: ts_mongoose_1.Type.boolean({ default: true }),
    user: ts_mongoose_1.Type.ref(ts_mongoose_1.Type.objectId()).to("Topics", topicModel),
    header: ts_mongoose_1.Type.string({ required: true }),
    description: ts_mongoose_1.Type.string({ required: true }),
    type: ts_mongoose_1.Type.number({ default: Constants_1.PollTypes.Default }),
    typeFlags: ts_mongoose_1.Type.array().of({ flag: ts_mongoose_1.Type.number({ default: 0 }), payload: ts_mongoose_1.Type.string() }),
    answers: ts_mongoose_1.Type.array({ required: true }).of({
        text: ts_mongoose_1.Type.string(),
        type: ts_mongoose_1.Type.number(),
        votes: ts_mongoose_1.Type.number() //How many votes this specific answer got
    }),
    expirationDate: ts_mongoose_1.Type.date({ required: true }),
    topics: ts_mongoose_1.Type.array().of({ topic: ts_mongoose_1.Type.string({ required: true }) }),
    scoreOverall: ts_mongoose_1.Type.number({ default: 0 }),
    rankOverall: ts_mongoose_1.Type.number({ default: 0 }),
    rankCategory: ts_mongoose_1.Type.number({ default: 0 }),
    flag: ts_mongoose_1.Type.number({ default: 0 }),
}, { _id: true, timestamps: true });
exports.pollModel = ts_mongoose_1.typedModel('Polls', pollSchema);
//# sourceMappingURL=Poll.js.map