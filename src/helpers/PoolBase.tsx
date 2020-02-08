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
    async changePoolItemPriority(contentID, priority:number, userID?){
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
            contentModel.updateMany({content: contentID}, {$inc: {priority: 2}}).exec();
        }
    }


    /**
     * Get Items for the feed
     */
    async getItemsForFeed(userID, amount:number){

        // Items with the highest priority and the latest creation date are sent first. Priority > Creation Date
        let feedItems = await contentModel
            .find({user: userID})
            .sort({priority:-1})
            .sort({"created_at": -1})
            .limit(amount)
            .exec();

        let index = await feedModel
            .findOne({user: userID})
            .sort({index:-1})
            .select("index -_id");

        let resultIndex = 0;
        if (index){
            resultIndex = index.index + 1;
        }
        let data = []
        for(let i = 0; i < feedItems.length; i++){
            data.push(await this.createFeedItem(feedItems[i], resultIndex + i));
            console.log("running")
        }
        return data;
    }

    /**
     * Merge with getItemsForFeed -> Also implement standard naming scheme!
     */
    async restoreFeed(userID, index, count, asc){
        let border;

        if(asc=="true"){
            border = index + count;
        }
        else{
            border = index - count;
        }
        let counter = await feedModel.find({user: userID, index: {$lt: border + 1, $gt: index - 1}}).sort({index: 1}).countDocuments();

        if(counter < count){
            await this.getItemsForFeed(userID,count-counter)
        }
        if(asc=="true"){
            return feedModel.find({user: userID, index: {$lt: border , $gt: index - 1}}).sort({index: 1});
        }
        else{
            return feedModel.find({user: userID, index: {$lt: index+1 , $gt: border }}).sort({index: -1});
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




