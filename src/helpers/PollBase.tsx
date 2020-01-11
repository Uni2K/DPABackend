import {performance} from 'perf_hooks';
import {pollModel} from "../models/Poll";
import {topicModel} from "../models/Topic";
import {userModel} from "../models/User";
import {ERROR_USER_REPUTATION_NOT_ENOUGH, REQUEST_OK} from "./Constants";
import {adjustReputation, calculatePollTribute, isReputationEnough} from "./StatisticsBase";

export class PollBase {

    async createPoll(req, res) {

        const tributeValue = calculatePollTribute(req);
        if (isReputationEnough(req.user.reputation, tributeValue)) {
            throw Error(ERROR_USER_REPUTATION_NOT_ENOUGH);
        }

        const promise = new pollModel({
            expirationDate: req.body.expirationDate,
            user: req.body.userid,
            header: req.body.header,
            description: req.body.description,
            typeFlags: req.body.typeFlags,
            type: req.body.type,
            answers: req.body.answers,
        }).save().catch((error) => {
            console.log(error.message);
            res.status(error.message).send(error);

        }).then((result) => {
            adjustReputation(req.user, tributeValue);
            res.status(REQUEST_OK).send(result);

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
            .limit(pageSize)
            .exec();

    }
}
