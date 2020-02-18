"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const ts_mongoose_1 = require("ts-mongoose");
const Constants_1 = require("../helpers/Constants");
const Joi = require('@hapi/joi');
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
    topics: ts_mongoose_1.Type.array().of({ topicID: ts_mongoose_1.Type.string({ required: true }) }),
    scoreOverall: ts_mongoose_1.Type.number({ default: 0 }),
    rankOverall: ts_mongoose_1.Type.number({ default: 0 }),
    rankCategory: ts_mongoose_1.Type.number({ default: 0 }),
    flag: ts_mongoose_1.Type.number({ default: 0 }),
}, { _id: true, timestamps: true });
const schema = Joi.object({
    user: Joi.object().required(),
    header: Joi.string().required(),
    description: Joi.string().required(),
    type: Joi.number(),
    typeFlags: Joi.array(),
    answers: Joi.array().required(),
    expirationDate: Joi.date().required(),
    topics: Joi.array().required(),
    polltype: Joi.number().required()
});
function validate(enabled, header, description, answers, expirationDate, topics) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield schema.validate(enabled, header, description, answers, expirationDate, topics);
    });
}
exports.validatePoll = validate;
exports.pollModel = ts_mongoose_1.typedModel('Polls', pollSchema);
//# sourceMappingURL=Poll.js.map