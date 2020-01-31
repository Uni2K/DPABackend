import {contentPoolModel} from "../models/ContentPool";
import {feedPoolModel} from "../models/FeedPool";

export class PoolItemBase{

    async createPoolItem(userID:Object, contentID:Object, contentType:String, priority:Number){
        const content = new contentPoolModel({
            user : userID,
            content: contentID,
            contentType: contentType,
            priority: priority
        });
        await content.save();
    }

    async createFeedItem(poolItemID:Object){
        let poolItem = await contentPoolModel.findOne(poolItemID);
        const content = new feedPoolModel({
            user : poolItem.user,
            content: poolItem.content,
            contentType: poolItem.contentType,
            priority: poolItem.priority
        });
        await content.save();
        await poolItem.remove();
    }
}

