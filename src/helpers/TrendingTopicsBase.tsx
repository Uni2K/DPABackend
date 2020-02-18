import {performance} from 'perf_hooks';
import {topicBase} from "../app";
import {pollSnapshotModel} from "../models/PollSnapshot";
import {topicModel} from "../models/Topic";
import {REPUTATION_COMMENT, REPUTATION_VOTE, TRENDING_TOPICS_AMOUNT} from "./Constants";



export class TrendingTopicsBase {

    async getTrendingTopics(){
        const topics = await topicModel.find()
            .sort({scoreOverall: -1})
            .limit(TRENDING_TOPICS_AMOUNT)
            .lean();

        let data = [];

        for(let i = 0; i < topics.length; i++){

               let topicsWithSnapshots = {
                    topic: topics[i],
                    snapshots: await topicBase.getSnapshots(topics[i]._id)
                };

               data.push(topicsWithSnapshots)
        }
        return data;
    }
}
