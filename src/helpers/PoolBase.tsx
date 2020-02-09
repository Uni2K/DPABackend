import {contentModel} from "../models/Content";
import {feedModel} from "../models/FeedPool";
import {userModel} from "../models/User";

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
            .find({subscriptions: {$elemMatch: {content: userID}}}) //Selects the users with the specific userID inside the subs
        if(user) {
            users = [...user];
        }

        for(let i = 0; i < topics.length; i++){
            let topic = topics[i].topic;
            let user = await userModel
                .find({subscriptions: {$elemMatch: {content: topic}}}) //Same for topics
                .select("_id");
            if(user){
                users = [...users, ...user];
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
                this.incrementPoolItemPriority(pollID, 2, user) //Item already in pool, so increment priority
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




