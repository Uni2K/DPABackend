import {topicBase} from "../app";
import {pollModel} from "../models/Poll";
import {userModel} from "../models/User";
import {pollSnapshotModel} from "../models/PollSnapshot";
import { userSnapshotModel } from "../models/UserSnapshot";
import { topicSnapshotModel } from "../models/TopicSnapshot";


export class SnapshotsBase {

    /**
     * Creates a poll snapshot for this moment and saves it inside the collection, used for statistics
     * each snapshot should contain the field, the client is interested in. If i want the change in the of the score,
     * the snapshot should contain the score. If there is no such statistics planned, then we would not need any score inside t
     * snapshot
     */
    async createPollSnapshots() {
        /*
        pollModel.collection.find({enabled:true}).forEach(
            (doc)=>{
                new pollSnapshotModel(
                    {
                        pollID:doc._id,
                        scoreOverall: doc.scoreOverall, //Save score
                        answers:doc.answers //save answers in the snapshot cause they contain the number of votes
                    }
                ).save()
            }
        )
        userModel.collection.find({enabled:true}).forEach(
            (doc)=>{
                new userSnapshotModel(
                    {
                        user:doc._id,
                        reputationCount:doc.reputation //User snapshot containts ofc the reputation
                    }
                ).save()
            }
        )*/
        console.log("doing")
        const topics = await topicBase.getAllTopics()
        for (const doc of topics ) {

            const numberInTopic=await pollModel.find({enabled:true, topic:doc._id}).lean().countDocuments().exec()
            new topicSnapshotModel(
                {
                    topicID:doc._id,
                    pollCount:numberInTopic //For topics its interesting how many questions there are
                }
            ).save()
        }

    }

    //get Snapshots, not right here
    async getPollSnapshots(req){
        return pollSnapshotModel.find({enabled:true, pollID:req.body.pollID}).lean().exec()
    }

}
