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
class ListGenerator {
    constructor(pollModel, userModel, topicModel) {
        this.redisClient = require('redis').createClient;
        this.redis = this.redisClient(6379, 'localhost');
        this.userModel = userModel;
        this.pollModel = pollModel;
        this.topicModel = topicModel;
    }
    /**
     * Main Entry point for every contentlist, called by the client via the express router
     * @param req Input to extract request Parameters
     */
    getContent(req) {
        const type = req.body.type;
        const pageSize = req.body.pageSize;
        const index = req.body.index;
        const direction = req.body.direction; //Needed for clientsided paging
        const selectedTopic = req.body.topic; //Topic selected for the list, -1 -> overall
        const selectedSort = req.body.sort; //Ascending, Descending
        // this.refreshContentlist(type).then(r => )
        let entryPoint = index;
        if (direction < 0) {
            entryPoint = index - pageSize;
        }
        const endPoint = entryPoint + pageSize;
        const stringResult = this.redis.get(type);
        const listResult = JSON.parse(stringResult);
        const rangedArray = listResult.slice(entryPoint, endPoint);
        return JSON.stringify(rangedArray);
    }
    /**
     * Main routine for creating the list and refreshing the cache
     * 1. Calculate List
     * 2. JSON the list
     * 3. Save the list in Redis
     */
    refreshContentlist(type) {
        return __awaiter(this, void 0, void 0, function* () {
            const startTime = Date.now();
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
            const result = yield this.pollModel
                .find(query)
                //.skip(entryPoint)
                //  .limit(pageSize)
                .sort({ [sortingValue]: -1 })
                .lean() //Faster, no object structure
                .exec();
            const resultJSON = JSON.stringify(result);
            this.redis.set(type, resultJSON, function () {
                console.log("Updated Contentlist: " + type + " Time: " + (Date.now() - startTime) + "ms");
            });
        });
    }
}
//# sourceMappingURL=ListGenerator.js.map