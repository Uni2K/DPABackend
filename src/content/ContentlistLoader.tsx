import {ExtractDoc} from "ts-mongoose";
import {performance} from 'perf_hooks'
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
            this.refreshContentlist(0).then();
        }, 15000);

     //   this.createSamplePolls();

    }




    createSamplePolls() {
        console.log("creating samples...")
        const startTime:number=Date.now()
        for (let i = 0; i < 100000; i++) {
            new this.pollModel({
                expirationDate: Date.now(),
                header: "Example", description: "Just a random stupid question!"
                , type: 0, answers: [{
                    text: "Answer 1", type: 0,
                    votes: 100
                }],
                scoreOverall: Date.now()
            }).save();
        }
        console.log("finished sample creation in: "+(Date.now()-startTime))

    }

    /**
     * Main Entry point for every contentlist, called by the client via the express router
     * @param req Input to extract request Parameters
     */
    async getContent(req): Promise<string> {

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
        const stringResult = await this.redis.get(type.toString());

        const v = this.userModel.schema;
        type userType = ExtractDoc<typeof v>;
        const listResult: Array<string> = JSON.parse(stringResult);
        const rangedArray: Array<string> = listResult.slice(entryPoint, endPoint);

        //Populating
        const questions = await this.pollModel
            .find({_id: {$in: rangedArray}})
       //     .populate("tags", this.topicModel)
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
     */
    private async refreshContentlist(type: number) {
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

        const getTimeStart=performance.now()
        const stringResult = await this.redis.get(type.toString());
        const parsed=JSON.parse(stringResult)
        const getTimeEnd=performance.now()




        const searchTimeStart=performance.now()
        const result = await this.pollModel
            .find(query)
            .select("_id") //even faster
            //.skip(entryPoint)
            //  .limit(pageSize)
            .sort({[sortingValue]: -1})
            .limit(1000)  //faster
            .lean() //Faster, no object structure
            .exec();
        const searchTimeEnd=performance.now()
        const resultJSON = JSON.stringify(result);
        const stringeTimeEnd=performance.now()

        await this.redis.set(type.toString(), resultJSON)
            console.log("Updated Contentlist: " + type + " Searchtime: " + (searchTimeEnd - searchTimeStart).toPrecision(4) + "ms, Stringifytime: "+(stringeTimeEnd-searchTimeEnd).toPrecision(4)+"ms, Redistime: "+(performance.now()-stringeTimeEnd).toPrecision(4)+"ms getTime: " +(getTimeEnd-getTimeStart).toPrecision(4)+"ms  SIZE: " + result.length);



    }

}
