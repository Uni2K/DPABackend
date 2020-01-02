import {ExtractDoc} from "ts-mongoose";
import {performance} from 'perf_hooks'
import {CONTENTLIST_REFRESH_INTERVALL, CONTENTLIST_SIZE} from "../helpers/Constants";

enum ContentLists {
    Hot,
    Recent,
    Recommended,
    ScoreToplist

}
enum ContentFlags {
    Idle,
    Recommended,
    Hot,

}

export class ContentlistLoader {

    private userModel;
    private pollModel;
    private topicModel;
    private redisClient = require('async-redis').createClient;
    private redis = this.redisClient(6379, 'localhost');

    constructor(pollModel, userModel, topicModel) {
        this.userModel = userModel;
        this.pollModel = pollModel;
        this.topicModel = topicModel;
        setInterval(() => {
            this.refreshContentlist(0,"0").then();
        }, CONTENTLIST_REFRESH_INTERVALL);

     //   this.createSamplePolls();
    }




    /**
     * Main Entry point for every contentlist, called by the client via the express router
     * @param req Input to extract request Parameters
     * Todo: Implement client side sorting -> Requires the cached list to contain the sorting field -> currently only ids got saved
     */
    async getContent(req): Promise<string> {

        const type = req.body.type;
        const pageSize = req.body.pageSize;
        const index = req.body.index;
        const direction = req.body.direction; //Needed for clientsided paging

        let selectedTopic = req.body.topic; //Topic selected for the list, -1 -> overall
        const selectedSort = req.body.sort; //Ascending, Descending
        selectedTopic="0" //debug
        let entryPoint = index;
        if (direction < 0) {
            entryPoint = index - pageSize;
        }
        const endPoint = entryPoint + pageSize;
        const stringResult = await this.redis.get(this.generateCachedName(type.toString(),selectedTopic));

        const listResult: Array<string> = JSON.parse(stringResult);
        const rangedArray: Array<string> = listResult.slice(entryPoint, endPoint);

        //Populating, fast
        const questions = await this.pollModel
            .find({_id: {$in: rangedArray}})
            .populate("userid", "name avatar _id")
            .lean()
            .exec();

        return JSON.stringify(questions);

    }

    /**
     * Main routine for creating the list and refreshing the cache
     * 1. Calculate List
     * 2. JSON the list
     * 3. Save the list in Redis
     * TODO: Clean this up?!
     */
    private async refreshContentlist(type: number, topic: string) {

        let sortingValue = "scoreOverall";
        let sortingFlag = 0
        switch (type) {
            case ContentLists.ScoreToplist:
                sortingValue = "scoreOverall";
                break;
            case ContentLists.Recent:
                sortingValue = "createdAt";
                break;
            case ContentLists.Recommended:
                sortingValue = "-1"
                sortingFlag=ContentFlags.Recommended
                break;
            case ContentLists.Hot:
                sortingValue = "-1"
                sortingFlag=ContentFlags.Hot
                break;

        }
        const query = {};
        query["enabled"] = true

        if(topic!="-1") {
                 query["topic"] = topic
        }
        const searchTimeStart=performance.now()
        let result

        if(sortingValue!= "-1"){
         result=await this.createSimpleSortingList(sortingValue,query)
        }else{
            result=await this.createFlaggedList(sortingFlag,query)
        }


        const searchTimeEnd=performance.now()
        const resultJSON = JSON.stringify(result);
        const stringeTimeEnd=performance.now()

        await this.redis.set(this.generateCachedName(type.toString(),topic), resultJSON)
            console.log("Updated Contentlist: " + type + " Searchtime: " + (searchTimeEnd - searchTimeStart).toPrecision(4) + "ms, Stringifytime: "+(stringeTimeEnd-searchTimeEnd).toPrecision(4)+"ms, Redistime: "+(performance.now()-stringeTimeEnd).toPrecision(4)+"ms  SIZE: " + result.length);



    }

    /**
     * Lists that can be created using only an sorting value
     * @param sortingValue
     * @param query
     */
   async createSimpleSortingList(sortingValue: string, query: {}):Promise<any>{
       return this.pollModel
           .find(query)
           .select("_id") //even faster
           .sort({[sortingValue]: -1})
           .limit(CONTENTLIST_SIZE)  //faster
           .lean() //Faster, no object structure
           .exec();

    }

    /**
     * Lists that can be created by using some special flag
     */
    private async createFlaggedList(type: number, query: {}):Promise<any> {
        if(type==ContentFlags.Idle)return null
        query["flag"]=type
        return this.pollModel
            .find(query)
            .select("_id") //even faster
            .sort({"createdAt": -1}) //TODO: Improve sorting -> createdAt makes no sense
            .limit(CONTENTLIST_SIZE)  //faster
            .lean()
            .exec();

    }



    /**
     * There have to be multiple lists for every topic, simple name schema
     */
    generateCachedName(type:string, topic:string):string{
        return type.concat(topic)
    }


}
