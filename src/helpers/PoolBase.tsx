import {contentModel} from "../models/Content";
import {feedModel} from "../models/FeedPool";
import {userModel} from "../models/User";

export class PoolBase{

    async createPoolItem(userID:Object, contentID:Object, contentType:String, priority:Number){

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

        await content.save().then();
        await poolItem.remove();
    }

    async pollToPool(userID, pollID, topics){
        let users = await userModel
            .find({user: userID})
            .sort({index:-1})
            .select("_id");
    }

    async changePoolItemPriority(contentID, priority:number, userID?){
        if(userID){
            contentModel.findOneAndUpdate({content: contentID, user: userID}, {priority: priority}).exec();
        }
        else{
            contentModel.updateMany({content: contentID}, {priority: priority}).exec();
        }

    }

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

        for(let i = 0; i < feedItems.length; i++){
            this.createFeedItem(feedItems[i], resultIndex + i)
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




