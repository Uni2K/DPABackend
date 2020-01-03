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
const Poll_1 = require("../models/Poll");
const Topic_1 = require("../models/Topic");
module.exports = function () {
    const router = app_1.express.Router();
    router.post("/questions/byIDs", (req, res) => __awaiter(this, void 0, void 0, function* () {
        const ids = req.body.ids;
        const questions = yield Poll_1.pollModel
            .find({ _id: { $in: ids } })
            .populate("tags", Topic_1.topicModel)
            .populate("userid", "name avatar _id")
            .exec();
        res.status(200).send(questions);
    }));
    router.post("/questions/simple", (req, res) => __awaiter(this, void 0, void 0, function* () {
        const loadSize = req.body.loadSize;
        const searchQuery = req.body.searchQuery;
        const key = req.body.key;
        const older = req.body.older;
        const userid = req.body.userid;
        const query = {};
        query["enabled"] = true;
        if (searchQuery) {
            if (searchQuery.length > 0) {
                query["text"] = { $regex: searchQuery };
            }
        }
        if (userid) {
            query["userid"] = userid;
        }
        if (key != "-1") {
            if (!older)
                query["timestamp"] = { $gt: key };
            else
                query["timestamp"] = { $lt: key };
        }
        const questions = yield Poll_1.pollModel
            .find(query)
            .sort({ timestamp: -1 })
            .limit(loadSize)
            .populate("tags", Topic_1.topicModel)
            .populate("userid", "name avatar _id")
            .exec();
        res.status(200).send(questions);
    }));
    return router;
};
//# sourceMappingURL=QuestionRouter.js.map