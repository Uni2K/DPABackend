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
const app_1 = require("../app");
const Constants_1 = require("../helpers/Constants");
const { validate } = require("../helpers/Validate");
const Joi = require('@hapi/joi');
module.exports = function () {
    const router = app_1.express.Router();
    router.post("/topics/all", (req, res) => __awaiter(this, void 0, void 0, function* () {
        const result = yield app_1.topicBase.getAllTopics();
        res.status(200).send(result);
    }));
    router.post("/topics/details", (req, res) => __awaiter(this, void 0, void 0, function* () {
        const schema = Joi.object({
            topic: Joi.array().required(),
        });
        yield validate(schema, req, res);
        const topicID = req.body.topic;
        const result = yield app_1.topicBase.getTopicDetails(topicID);
        res.status(200).send(result);
    }));
    router.post("/topics/snapshot", (req, res) => __awaiter(this, void 0, void 0, function* () {
        const schema = Joi.object({
            topicID: Joi.array().required(),
        });
        yield validate(schema, req, res);
        app_1.topicBase.getSnapshots(req).then((result) => {
            res.status(Constants_1.REQUEST_OK).send(result);
        }).catch((err) => {
            res.status(Constants_1.ERROR_USER_UNKNOWN).send(err);
        });
    }));
    //createTag()
    return router;
};
//# sourceMappingURL=TopicRouter.js.map