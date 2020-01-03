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
const perf_hooks_1 = require("perf_hooks");
const Poll_1 = require("../models/Poll");
const Topic_1 = require("../models/Topic");
const User_1 = require("../models/User");
const Constants_1 = require("./Constants");
const StatisticsBase_1 = require("./StatisticsBase");
class PollBase {
    createPoll(req) {
        return __awaiter(this, void 0, void 0, function* () {
            if (StatisticsBase_1.isReputationEnough(req.user.reputation, Constants_1.REPUTATION_THRESHOLD_CREATE)) {
                throw Error(Constants_1.ERROR_USER_REPUTATION_NOT_ENOUGH);
            }
            const promise = new Poll_1.pollModel({
                expirationDate: req.body.expirationDate,
                user: req.body.userid,
                header: req.body.header,
                description: req.body.description,
                type: req.body.type,
                answers: req.body.answers,
            }).save();
            return promise;
        });
    }
    createSamplePolls() {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("Poll Creation started!");
            const startTime = perf_hooks_1.performance.now();
            yield User_1.userModel.remove({}).exec();
            const user = yield User_1.userModel.findOne().exec();
            for (let i = 0; i < 1000; i++) {
                const poll = new Poll_1.pollModel({
                    expirationDate: Date.now(),
                    user: [user._id],
                    header: "Example", description: "Just a random stupid question!",
                    type: 0, answers: [{
                            text: "Answer 1", type: 0,
                            votes: 100
                        }],
                    scoreOverall: Date.now()
                }).save();
                // console.log((i + 1) + "/" +number + " Poll Created: " + poll._id + "  TIME: " + (performance.now() - startTime));
            }
        });
    }
    getPollsByIds(ids) {
        return __awaiter(this, void 0, void 0, function* () {
            return Poll_1.pollModel
                .find({ _id: { $in: ids } })
                .populate("tags", Topic_1.topicModel)
                .populate("userid", "name avatar _id")
                .exec();
        });
    }
    searchPolls(req) {
        return __awaiter(this, void 0, void 0, function* () {
            const searchQuery = req.body.query;
            const index = req.body.index;
            const pageSize = req.body.pageSize;
            const direction = req.body.direction;
            const filterTopics = req.body.filterTopics;
            const sort = req.body.sort;
            const minimumVotes = req.body.minimumVotes;
            const query = {};
            query["header"] = { $regex: searchQuery };
            query["enabled"] = true;
            let entryPoint = index;
            if (direction < 0) {
                entryPoint = index - pageSize;
            }
            if (filterTopics !== undefined)
                query["topic"] = { $in: filterTopics };
            return Poll_1.pollModel
                .find(query)
                .sort({ "createdAt": -1 })
                .skip(entryPoint)
                .limit(pageSize)
                .exec();
        });
    }
}
exports.PollBase = PollBase;
//# sourceMappingURL=PollBase.js.map