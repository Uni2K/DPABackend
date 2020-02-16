import {performance} from 'perf_hooks';
import {topicBase} from "../app";
import {contentModel} from "../models/Content";
import {pollModel} from "../models/Poll";
import {pollSnapshotModel} from "../models/PollSnapshot";
import {topicModel} from "../models/Topic";
import {userModel} from "../models/User";
import {poolBase} from "../app";
import {
    ERROR_USER_REPUTATION_NOT_ENOUGH,
    PollDurations,
    PollTypeFlags,
    PollTypes,
    REQUEST_OK, TRIBUT_CREATE_DEFAULT, TRIBUT_CREATE_DEFAULT_IMAGE,TRIBUT_CREATE_PRIVATESUB,TRIBUT_CREATE_THREAD,TRIBUT_CREATE_PRIVATESTRICT,TRIBUT_CREATE_LOCAL,TRIBUT_CREATE_TOF,TRIBUT_CREATE_DEEP,
    REPUTATION_VOTE, REPUTATION_COMMENT
} from "./Constants";
import {PoolBase} from "./PoolBase";
import {adjustReputation, calculatePollTribute, isReputationEnough} from "./StatisticsBase";



/**
 * All specific poll based functions
 */
export class PollBase {

    async createPoll(req, res) {

        const tributeValue = calculatePollTribute(req);
        //Dont do it, when there is not enough tribute -> give the client a correct response to handle it
        if (isReputationEnough(req.body.user.reputation, tributeValue)) {
            throw Error(ERROR_USER_REPUTATION_NOT_ENOUGH);
        }

        let pollID;
        const promise = new pollModel({
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
            adjustReputation(req.body.user, tributeValue); //Saved finally -> adjust the reputation now
            res.status(REQUEST_OK).send(result); //send the created poll to the user
            if(result){
                pollID = result;
                poolBase.pollToPool(req.body.user._id, pollID, req.body.topics).then();
            }
        });

        await promise;

    }

    async createSamplePolls() {
        console.log("Poll Creation started!");
        const startTime = performance.now();
        await userModel.remove({}).exec();
        const user = await userModel.findOne().exec();

        for (let i = 0; i < 1000; i++) {
            const poll = new pollModel({
                expirationDate: Date.now(),
                user: [user._id],
                header: "Example", description: "Just a random stupid question!"
                , type: 0, answers: [{
                    text: "Answer 1", type: 0,
                    votes: 100
                }],
                scoreOverall: Date.now()
            }).save();
            // console.log((i + 1) + "/" +number + " Poll Created: " + poll._id + "  TIME: " + (performance.now() - startTime));

        }

    }

    /**
     * Used for the client to fetch updates for a specific ID Array
     * @param ids List of poll Ids
     */
    async getPollsByIds(pollIDs: any) {
        return pollModel
            .find({_id: {$in: pollIDs}})
            .populate("tags", topicModel)
            .populate("userid", "name avatar _id")
            .exec();
    }

    /**
     *  Search polls, used by search features inside the app
     * @param req Request
     */
    async searchPolls(req) {
        const searchQuery = req.body.query;
        const index = req.body.index;
        const pageSize = req.body.pageSize;
        const direction = req.body.direction;
        const filterTopics = req.body.filterTopics;
        const sort = req.body.sort;
        const minimumVotes = req.body.minimumVotes;

        const query = {};
        query["header"] = {$regex: searchQuery};
        query["enabled"] = true;
        let entryPoint = index;
        if (direction < 0) {
            entryPoint = index - pageSize;
        }
        if (filterTopics !== undefined) {
            query["topic"] = {$in: filterTopics};
        }
        return pollModel
            .find(query)
            .sort({"createdAt": -1})
            .skip(entryPoint)
            .lean()
            .limit(pageSize)
            .exec();

    }

    /**
     * Sends metadata to the client to make sure, the created poll contains the correct types,
     * used for the poll creator
     * -> Polltypes -> Polltypeflags -> Durations -> Tributes
     */
    getCreationMetadata():string {
        let jsonArray = [];
        jsonArray["pollTypes"]=PollTypes.toString()
        jsonArray["pollTypeFlags"]=PollTypeFlags.toString()
        jsonArray["pollDurations"]=PollDurations.toString()
        const varToString = varObj => Object.keys(varObj)[0]

        const tributes={}
        tributes[varToString({TRIBUT_CREATE_DEFAULT})]=TRIBUT_CREATE_DEFAULT
        tributes[varToString({TRIBUT_CREATE_DEFAULT_IMAGE})]=TRIBUT_CREATE_DEFAULT_IMAGE
        tributes[varToString({TRIBUT_CREATE_PRIVATESUB})]=TRIBUT_CREATE_PRIVATESUB
        tributes[varToString({TRIBUT_CREATE_PRIVATESTRICT})]=TRIBUT_CREATE_PRIVATESTRICT
        tributes[varToString({TRIBUT_CREATE_DEEP})]=TRIBUT_CREATE_DEEP
        tributes[varToString({TRIBUT_CREATE_THREAD})]=TRIBUT_CREATE_THREAD
        tributes[varToString({TRIBUT_CREATE_LOCAL})]=TRIBUT_CREATE_LOCAL
        tributes[varToString({TRIBUT_CREATE_TOF})]=TRIBUT_CREATE_TOF

        jsonArray["tributes"]=tributes
        return JSON.stringify(jsonArray)
    }

    async setScore(pollID, action){
        switch(action){
            case "comment": {
                this.updateScore(pollID, REPUTATION_COMMENT); // Constanten benutzen
                break;
            }
            case "vote": {
                this.updateScore(pollID, REPUTATION_VOTE)
            }
        }
    }

    async updateScore(pollID, value){
        return await contentModel.findOneAndUpdate({_id: pollID}, {$inc: {scoreOverall: value}}).exec();
    }
}
