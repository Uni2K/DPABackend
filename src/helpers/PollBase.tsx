import {performance} from 'perf_hooks';
import {topicBase} from "../app";
import {pollModel} from "../models/Poll";
import {pollSnapshotModel} from "../models/PollSnapshot";
import {topicModel} from "../models/Topic";
import {userModel} from "../models/User";
import {
    ERROR_USER_REPUTATION_NOT_ENOUGH,
    PollDurations,
    PollTypeFlags,
    PollTypes,
    REQUEST_OK, TRIBUT_CREATE_DEFAULT, TRIBUT_CREATE_DEFAULT_IMAGE,TRIBUT_CREATE_PRIVATESUB,TRIBUT_CREATE_THREAD,TRIBUT_CREATE_PRIVATESTRICT,TRIBUT_CREATE_LOCAL,TRIBUT_CREATE_TOF,TRIBUT_CREATE_DEEP
} from "./Constants";
import {PoolBase} from "./PoolBase";
import {adjustReputation, calculatePollTribute, isReputationEnough} from "./StatisticsBase";
import { userSnapshotModel } from '../models/UserSnapshot';
import { topicSnapshotModel } from '../models/TopicSnapshot';

export class PollBase {

    async createPoll(req, res) {

        const tributeValue = calculatePollTribute(req);
        if (isReputationEnough(req.user.reputation, tributeValue)) {
            throw Error(ERROR_USER_REPUTATION_NOT_ENOUGH);
        }

        let pollID;

        const promise = new pollModel({
            expirationDate: req.body.expirationDate,
            user: req.body.userid,
            header: req.body.header,
            description: req.body.description,
            typeFlags: req.body.typeFlags,
            type: req.body.type,
            answers: req.body.answers,
            topics: req.body.topics,
        }).save().catch((error) => {
            console.log(error.message);
            res.status(error.message).send(error);

        }).then((result) => {
            adjustReputation(req.user, tributeValue);
            res.status(REQUEST_OK).send(result);
            if(result){
                pollID = result.id;
            }
        });

        const feedCreation = new PoolBase();
        feedCreation.pollToPool(req.body.userid, pollID, req.body.topics).then();
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

    async getPollsByIds(ids: any) {
        return pollModel
            .find({_id: {$in: ids}})
            .populate("tags", topicModel)
            .populate("userid", "name avatar _id")
            .exec();
    }

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

    async createSnapShots() {
        pollModel.collection.find({enabled:true}).forEach(
            (doc)=>{
               new pollSnapshotModel(
                   {
                       pollid:doc._id,
                       answers:doc.answers
                   }
               ).save()
            }
        )
        userModel.collection.find({enabled:true}).forEach(
            (doc)=>{
                new userSnapshotModel(
                    {
                        user:doc._id,
                        reputationCount:doc.reputation
                    }
                ).save()
            }
        )
       const topics=await topicBase.getAllTopics()
        for (const doc of topics ) {

            const numberInTopic=await pollModel.find({enabled:true, topic:doc._id}).lean().count().exec()
            new topicSnapshotModel(
                {
                    topicid:doc._id,
                    pollCount:numberInTopic
                }
            ).save()
        }

    }


    async getSnapshots(req){
       return pollSnapshotModel.find({enabled:true, pollid:req.body.pollid}).lean().exec()
    }


    /**
     * Sends metadata to the client to make sure, the created poll contains the correct types
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
}
