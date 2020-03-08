import {contentModel} from "../models/Content";
import {feedModel} from "../models/FeedPool";
import {pollModel} from "../models/Poll";
import {topicSpecialItemModel} from "../models/TopicSpecial";
import {userModel} from "../models/User";
import {pollSnapshotModel} from "../models/PollSnapshot";
import {NUMBER_OF_SNAPSHOTS, PRIORITY_MULTIPLE_SUBED_CONTENT} from "./Constants";

export class PoolBase{

    async createPoolItem(userID, contentID, contentType:String, priority:Number){

        const content = new contentModel({
            user : userID,
            content: contentID,
            contentType: contentType,
            priority: priority
        });

        await content.save();
    }

    async createFeedItem(poolItem, index:number){

        const content = new feedModel({
            user : poolItem.user,
            content: poolItem.content,
            contentType: poolItem.contentType,
            priority: poolItem.priority,
            index: index
        });
        let data = []
        await content.save().then((result) => {data.push(result)});
        await poolItem.remove();
        return data;
    }

    /**
     *
     * @param userID The userID of the poll
     * @param pollID The ID of the poll
     * @param topics -> SINGLE Topic of the poll
     */
    async pollToPool(userID, pollID, topics){
        let users = [];


        let user = await userModel
            .find({subscriptions: {$elemMatch: {content: userID.toString()}}})
            .select("_id"); //Selects the users with the specific userID inside the subs
        if(user) {
            users = [...user];
        }

        for(let i = 0; i < topics.length; i++){
            let topic = topics[i].topicID;
            let user = await userModel
                .find({subscriptions: {$elemMatch: {content: topic}}}) //Same for topics
                .select("_id");
            if(user){
                users = [...users, ...user];
            }
        }

        for(let i = 0; i < topics.length; i++){
            let specialTopics = await topicSpecialItemModel
                .find({topicID: topics[i].topicID})
                .select("specialTopicID -_id");
            for(let i = 0; i < specialTopics.length; i++) {
                let user = await userModel
                    .find({subscriptions: {$elemMatch: {content: specialTopics[i].specialTopicID}}}) //Same for topics
                    .select("_id");
                if (user) {
                    users = [...users, ...user];
                }
            }
        }

        let result = [];
        //Iterate through subscribed users and topics
        for(let i = 0; i < users.length; i++){

            let value = users[i]._id.toString();
            let index = result.indexOf(value);

            if(index < 0){ //Item not yet in the result
                result.push(value);
                let user = await userModel.findOne({_id: value});
                this.createPoolItem(user, pollID, "poll", 0);
            }
            else{
                console.log(PRIORITY_MULTIPLE_SUBED_CONTENT)
                this.incrementPoolItemPriority(pollID, PRIORITY_MULTIPLE_SUBED_CONTENT.valueOf(), user) //Item already in pool, so increment priority
            }
        }

    }

    /**
     * changing priority of pool items
     */
    async incrementSinglePoolItemPriority(contentID, priority:number, userID?){
        if(userID){
            contentModel.findOneAndUpdate({content: contentID, user: userID}, {priority: priority}).exec();
        }
        else{
            contentModel.updateMany({content: contentID}, {priority: priority}).exec();
        }
    }

    /**
     * Only icrementing the priotity
     */
    async incrementPoolItemPriority(contentID, increment:number, userID?){
        if(userID){
            contentModel.findOneAndUpdate({content: contentID, user: userID}, {$inc: {priority: increment}}).exec();
        }
        else{
            contentModel.updateMany({content: contentID}, {$inc: {priority: increment}}).exec();
        }
    }

    async poolRating(){
        const content = await contentModel.find();
        for(let i = 0; i < content.length; i++){
            console.log(content[i]._id)
            console.log(await this.getPriority(await content[i]._id));
        }
    }

    async getPriority(poolID){
        const poolItem = await contentModel.findOne({_id: poolID})
        let totalNumberOfVotes = await pollModel.aggregate([
            {
                $addFields: {
                    totalVotes: {$sum: "$answers.votes"}
                },
            },
            {
                $match: {_id: poolItem.content}
            }
        ] )

        const snapshots = await pollSnapshotModel.aggregate([
            {
                $addFields: {
                    totalVotes: {$sum: "$answers.votes"}
                },
            },
            {
                $match: {pollID: poolItem.content.toString() }
            }
        ] ).sort({"createdAt": -1}).limit(NUMBER_OF_SNAPSHOTS);

        const oldNumberOfVotes = snapshots[snapshots.length -1 ].totalVotes
        const numberOfVotes = totalNumberOfVotes[0].totalVotes;

        return numberOfVotes * 0.5 + numberOfVotes - oldNumberOfVotes;


    }

    async generateTestData(){
        let user = await userModel.find().limit(2);

        for(let i = 0; i < 50; i++){
            let userCount = 0;
            if(i%2 === 0){
                userCount = 1;
            }
            const itemCreator = new PoolBase()
            await itemCreator.createPoolItem(user[userCount],user[userCount],"cba", i)
        }

    }

}




