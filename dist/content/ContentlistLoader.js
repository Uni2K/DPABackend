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
class ContentlistLoader {
    constructor(pollModel, userModel, topicModel) {
        this.redisClient = require('async-redis').createClient;
        this.redis = this.redisClient(6379, 'localhost');
        this.userModel = userModel;
        this.pollModel = pollModel;
        this.topicModel = topicModel;
        setInterval(() => {
            this.refreshContentlist(0).then();
        }, 15000);
        //   this.createSamplePolls();
    }
    createSamplePolls() {
        console.log("creating samples...");
        const startTime = Date.now();
        for (let i = 0; i < 100000; i++) {
            new this.pollModel({
                expirationDate: Date.now(),
                header: "Example", description: "Just a random stupid question!",
                type: 0, answers: [{
                        text: "Answer 1", type: 0,
                        votes: 100
                    }],
                scoreOverall: Date.now()
            }).save();
        }
        console.log("finished sample creation in: " + (Date.now() - startTime));
    }
    /**
     * Main Entry point for every contentlist, called by the client via the express router
     * @param req Input to extract request Parameters
     */
    getContent(req) {
        return __awaiter(this, void 0, void 0, function* () {
            const type = req.body.type;
            const pageSize = req.body.pageSize;
            const index = req.body.index;
            const direction = req.body.direction; //Needed for clientsided paging
            const selectedTopic = req.body.topic; //Topic selected for the list, -1 -> overall
            const selectedSort = req.body.sort; //Ascending, Descending
            let entryPoint = index;
            if (direction < 0) {
                entryPoint = index - pageSize;
            }
            const endPoint = entryPoint + pageSize;
            const stringResult = yield this.redis.get(type.toString());
            const v = this.userModel.schema;
            const listResult = JSON.parse(stringResult);
            const rangedArray = listResult.slice(entryPoint, endPoint);
            //Populating
            const questions = yield this.pollModel
                .find({ _id: { $in: rangedArray } })
                //     .populate("tags", this.topicModel)
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
     */
    refreshContentlist(type) {
        return __awaiter(this, void 0, void 0, function* () {
            //  const selectedTopic = req.body.topic
            let sortingValue = "scoreOverall";
            switch (type) {
                case 0: //e.g Hot
                    sortingValue = "scoreOverall";
                    break;
                case 1:
                    sortingValue = "rankOverall";
                    break;
                case 2:
                    sortingValue = "rankCategory";
                    break;
            }
            const query = {};
            query["enabled"] = true;
            /*
                 if(selectedTopic!="-1"){
              query["topic"]=selectedTopic
            }
    
            let entryPoint = index
            if (direction < 0) {
                entryPoint = index - pageSize
            }
             */
            const getTimeStart = perf_hooks_1.performance.now();
            const stringResult = yield this.redis.get(type.toString());
            const parsed = JSON.parse(stringResult);
            const getTimeEnd = perf_hooks_1.performance.now();
            const searchTimeStart = perf_hooks_1.performance.now();
            const result = yield this.pollModel
                .find(query)
                .select("_id") //even faster
                //.skip(entryPoint)
                //  .limit(pageSize)
                .sort({ [sortingValue]: -1 })
                .limit(1000) //faster
                .lean() //Faster, no object structure
                .exec();
            const searchTimeEnd = perf_hooks_1.performance.now();
            const resultJSON = JSON.stringify(result);
            const stringeTimeEnd = perf_hooks_1.performance.now();
            yield this.redis.set(type.toString(), resultJSON);
            console.log("Updated Contentlist: " + type + " Searchtime: " + (searchTimeEnd - searchTimeStart).toPrecision(4) + "ms, Stringifytime: " + (stringeTimeEnd - searchTimeEnd).toPrecision(4) + "ms, Redistime: " + (perf_hooks_1.performance.now() - stringeTimeEnd).toPrecision(4) + "ms getTime: " + (getTimeEnd - getTimeStart).toPrecision(4) + "ms  SIZE: " + result.length);
        });
    }
}
exports.ContentlistLoader = ContentlistLoader;
//# sourceMappingURL=ContentlistLoader.js.map