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
const Constants_1 = require("../helpers/Constants");
var ContentLists;
(function (ContentLists) {
    ContentLists[ContentLists["Hot"] = 0] = "Hot";
    ContentLists[ContentLists["Recent"] = 1] = "Recent";
    ContentLists[ContentLists["Recommended"] = 2] = "Recommended";
    ContentLists[ContentLists["ScoreToplist"] = 3] = "ScoreToplist";
})(ContentLists || (ContentLists = {}));
var ContentFlags;
(function (ContentFlags) {
    ContentFlags[ContentFlags["Idle"] = 0] = "Idle";
    ContentFlags[ContentFlags["Recommended"] = 1] = "Recommended";
    ContentFlags[ContentFlags["Hot"] = 2] = "Hot";
})(ContentFlags || (ContentFlags = {}));
class ContentlistLoader {
    constructor(pollModel, userModel, topicModel) {
        this.redisClient = require('async-redis').createClient;
        this.redis = this.redisClient(6379, 'localhost');
        this.userModel = userModel;
        this.pollModel = pollModel;
        this.topicModel = topicModel;
        setInterval(() => {
            this.refreshContentlist(0, "0").then();
        }, Constants_1.CONTENTLIST_REFRESH_INTERVALL);
        //   this.createSamplePolls();
    }
    /**
     * Main Entry point for every contentlist, called by the client via the express router
     * @param req Input to extract request Parameters
     * Todo: Implement client side sorting -> Requires the cached list to contain the sorting field -> currently only ids got saved
     */
    getContent(req) {
        return __awaiter(this, void 0, void 0, function* () {
            const type = req.body.type;
            const pageSize = req.body.pageSize;
            const index = req.body.index;
            const direction = req.body.direction; //Needed for clientsided paging
            let selectedTopic = req.body.topic; //Topic selected for the list, -1 -> overall
            const selectedSort = req.body.sort; //Ascending, Descending
            selectedTopic = "0"; //debug
            let entryPoint = index;
            if (direction < 0) {
                entryPoint = index - pageSize;
            }
            const endPoint = entryPoint + pageSize;
            const stringResult = yield this.redis.get(this.generateCachedName(type.toString(), selectedTopic));
            const listResult = JSON.parse(stringResult);
            const rangedArray = listResult.slice(entryPoint, endPoint);
            //Populating, fast
            const questions = yield this.pollModel
                .find({ _id: { $in: rangedArray } })
                .populate("userid", "name avatar _id")
                .lean()
                .exec();
            return JSON.stringify(questions);
        });
    }
    /**
     * Main routine for creating the list and refreshing the cache
     * 1. Calculate List
     * 2. JSON the list
     * 3. Save the list in Redis
     * TODO: Clean this up?!
     */
    refreshContentlist(type, topic) {
        return __awaiter(this, void 0, void 0, function* () {
            let sortingValue = "scoreOverall";
            let sortingFlag = 0;
            switch (type) {
                case ContentLists.ScoreToplist:
                    sortingValue = "scoreOverall";
                    break;
                case ContentLists.Recent:
                    sortingValue = "createdAt";
                    break;
                case ContentLists.Recommended:
                    sortingValue = "-1";
                    sortingFlag = ContentFlags.Recommended;
                    break;
                case ContentLists.Hot:
                    sortingValue = "-1";
                    sortingFlag = ContentFlags.Hot;
                    break;
            }
            const query = {};
            query["enabled"] = true;
            if (topic != "-1") {
                query["topic"] = topic;
            }
            const searchTimeStart = perf_hooks_1.performance.now();
            let result;
            if (sortingValue != "-1") {
                result = yield this.createSimpleSortingList(sortingValue, query);
            }
            else {
                result = yield this.createFlaggedList(sortingFlag, query);
            }
            const searchTimeEnd = perf_hooks_1.performance.now();
            const resultJSON = JSON.stringify(result);
            const stringeTimeEnd = perf_hooks_1.performance.now();
            yield this.redis.set(this.generateCachedName(type.toString(), topic), resultJSON);
            console.log("Updated Contentlist: " + type + " Searchtime: " + (searchTimeEnd - searchTimeStart).toPrecision(4) + "ms, Stringifytime: " + (stringeTimeEnd - searchTimeEnd).toPrecision(4) + "ms, Redistime: " + (perf_hooks_1.performance.now() - stringeTimeEnd).toPrecision(4) + "ms  SIZE: " + result.length);
        });
    }
    /**
     * Lists that can be created using only an sorting value
     * @param sortingValue
     * @param query
     */
    createSimpleSortingList(sortingValue, query) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.pollModel
                .find(query)
                .select("_id") //even faster
                .sort({ [sortingValue]: -1 })
                .limit(Constants_1.CONTENTLIST_SIZE) //faster
                .lean() //Faster, no object structure
                .exec();
        });
    }
    /**
     * Lists that can be created by using some special flag
     */
    createFlaggedList(type, query) {
        return __awaiter(this, void 0, void 0, function* () {
            if (type == ContentFlags.Idle)
                return null;
            query["flag"] = type;
            return this.pollModel
                .find(query)
                .select("_id") //even faster
                .sort({ "createdAt": -1 }) //TODO: Improve sorting -> createdAt makes no sense
                .limit(Constants_1.CONTENTLIST_SIZE) //faster
                .lean()
                .exec();
        });
    }
    /**
     * There have to be multiple lists for every topic, simple name schema
     */
    generateCachedName(type, topic) {
        return type.concat(topic);
    }
}
exports.ContentlistLoader = ContentlistLoader;
//# sourceMappingURL=ContentlistLoader.js.map