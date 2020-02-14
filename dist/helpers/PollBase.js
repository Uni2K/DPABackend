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
const app_1 = require("../app");
const Constants_1 = require("./Constants");
const StatisticsBase_1 = require("./StatisticsBase");
/**
 * All specific poll based functions
 */
class PollBase {
    createPoll(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const tributeValue = StatisticsBase_1.calculatePollTribute(req);
            //Dont do it, when there is not enough tribute -> give the client a correct response to handle it
            if (StatisticsBase_1.isReputationEnough(req.body.user.reputation, tributeValue)) {
                throw Error(Constants_1.ERROR_USER_REPUTATION_NOT_ENOUGH);
            }
            let pollID;
            const promise = new Poll_1.pollModel({
                expirationDate: req.body.expirationDate,
                user: req.body.user,
                header: req.body.header,
                description: req.body.description,
                typeFlags: req.body.typeFlags,
                type: req.body.type,
                answers: req.body.answers,
                topics: req.body.topics,
            }).save().catch((error) => {
                console.log(error.message);
                res.status(error.message).send(error); //Not saved -> just tell the client, no reputation adjustment
            }).then((result) => {
                StatisticsBase_1.adjustReputation(req.body.user, tributeValue); //Saved finally -> adjust the reputation now
                res.status(Constants_1.REQUEST_OK).send(result); //send the created poll to the user
                if (result) {
                    pollID = result;
                    app_1.poolBase.pollToPool(req.body.user._id, pollID, req.body.topics).then();
                }
            });
            yield promise;
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
    /**
     * Used for the client to fetch updates for a specific ID Array
     * @param ids List of poll Ids
     */
    getPollsByIds(pollIDs) {
        return __awaiter(this, void 0, void 0, function* () {
            return Poll_1.pollModel
                .find({ _id: { $in: pollIDs } })
                .populate("tags", Topic_1.topicModel)
                .populate("userid", "name avatar _id")
                .exec();
        });
    }
    /**
     *  Search polls, used by search features inside the app
     * @param req Request
     */
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
            if (filterTopics !== undefined) {
                query["topic"] = { $in: filterTopics };
            }
            return Poll_1.pollModel
                .find(query)
                .sort({ "createdAt": -1 })
                .skip(entryPoint)
                .lean()
                .limit(pageSize)
                .exec();
        });
    }
    /**
     * Sends metadata to the client to make sure, the created poll contains the correct types,
     * used for the poll creator
     * -> Polltypes -> Polltypeflags -> Durations -> Tributes
     */
    getCreationMetadata() {
        let jsonArray = [];
        jsonArray["pollTypes"] = Constants_1.PollTypes.toString();
        jsonArray["pollTypeFlags"] = Constants_1.PollTypeFlags.toString();
        jsonArray["pollDurations"] = Constants_1.PollDurations.toString();
        const varToString = varObj => Object.keys(varObj)[0];
        const tributes = {};
        tributes[varToString({ TRIBUT_CREATE_DEFAULT: Constants_1.TRIBUT_CREATE_DEFAULT })] = Constants_1.TRIBUT_CREATE_DEFAULT;
        tributes[varToString({ TRIBUT_CREATE_DEFAULT_IMAGE: Constants_1.TRIBUT_CREATE_DEFAULT_IMAGE })] = Constants_1.TRIBUT_CREATE_DEFAULT_IMAGE;
        tributes[varToString({ TRIBUT_CREATE_PRIVATESUB: Constants_1.TRIBUT_CREATE_PRIVATESUB })] = Constants_1.TRIBUT_CREATE_PRIVATESUB;
        tributes[varToString({ TRIBUT_CREATE_PRIVATESTRICT: Constants_1.TRIBUT_CREATE_PRIVATESTRICT })] = Constants_1.TRIBUT_CREATE_PRIVATESTRICT;
        tributes[varToString({ TRIBUT_CREATE_DEEP: Constants_1.TRIBUT_CREATE_DEEP })] = Constants_1.TRIBUT_CREATE_DEEP;
        tributes[varToString({ TRIBUT_CREATE_THREAD: Constants_1.TRIBUT_CREATE_THREAD })] = Constants_1.TRIBUT_CREATE_THREAD;
        tributes[varToString({ TRIBUT_CREATE_LOCAL: Constants_1.TRIBUT_CREATE_LOCAL })] = Constants_1.TRIBUT_CREATE_LOCAL;
        tributes[varToString({ TRIBUT_CREATE_TOF: Constants_1.TRIBUT_CREATE_TOF })] = Constants_1.TRIBUT_CREATE_TOF;
        jsonArray["tributes"] = tributes;
        return JSON.stringify(jsonArray);
    }
}
exports.PollBase = PollBase;
//# sourceMappingURL=PollBase.js.map