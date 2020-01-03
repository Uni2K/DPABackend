"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const Feed_1 = require("../models/Feed");
const Poll_1 = require("../models/Poll");
const Topic_1 = require("../models/Topic");
const User_1 = require("../models/User");
/** Order:
 * 1.User logged in -> getInitialFeed for userid -> Feed is empty -> Load 50 questions in the feed to enable some backscroll
 * 2. Return feed, starting from 0 at the first of the 50 items
 * 3. All X seconds a worker checks if there are new questions which the user is subscribed to-> add these Questions/Users/Topics to the feed
 * 4. Feed got increased -> Update user with socket
 *
 * Questions in Feed need to be sorted by Timestamp, Other things are just put in between depending on the index:
 * ArrayIndex  Type Index Timestamp
 * 0            Q     3       300
 * 1            Q     0       200
 * 2            U     2        -1         Index matches Array Index
 * 3            Q     1       100
 *
 * createQuestion -> insertedInDB->addQuestionID to FEED-> How?
 * Passiv, onCreate: User has "subscribed", for each item search search content and fill into Feedlist -> save into Feed object, last timestamp as beginning point for new onCreate
 * Aktiv, newQuestion:  Socket Rooms -> add to Feed List
 * Changing subscribtion: Remove all Content with the specific userid/topic from the feed list and the user sub list
 */
/**
 * Better: Store selected feed tags on the server-> load the 50 questions of the correct tags
 */
class FeedLoader {
    getFeed(res, userid_, loadsize, index, older) {
        return __awaiter(this, void 0, void 0, function* () {
            // Find User to get his Subscriptions
            const user = yield User_1.userModel
                .findById({
                _id: userid_
            })
                .lean()
                .select("subscriptions")
                .exec();
            const userSubscriptions = user["subscriptions"];
            //Filter the user subscriptions by their types: T-> Question from Topic Subscription, U-> Question From User Subscription
            const topicContent = userSubscriptions.filter(function (item) {
                return item.type == "T";
            }).map(item => item.content);
            const userContent = userSubscriptions.filter(function (item) {
                return item.type == "U";
            }).map(item => item.content);
            //Fetch Content
            const query = {};
            query["enabled"] = true;
            if (older) {
                query["timestamp"] = { $lt: index };
            }
            else
                query["timestamp"] = { $gt: index };
            query["$or"] = [{ userid: { $in: userContent } }, { tags: { $in: topicContent } }];
            const questionsInFeed = yield Poll_1.pollModel
                .find(query)
                //.select("_id")
                .sort({ timestamp: -1 })
                .limit(loadsize)
                .populate("tags", Topic_1.topicModel)
                .populate("userid", "name avatar")
                .lean()
                .exec();
            console.log("GET FEED Config: " + userid_ + " " + loadsize + " " + older + "  " + index + "  " + questionsInFeed.length);
            return questionsInFeed;
            //Add the direct items, User, Topics -> they got a timestamp in the subscription, if it matches -> LATER
            /* if(older){
               var indexStart=index
               var indexEnd=questionsInFeed[questionsInFeed.length-1].timestamp
             }
    
    
    
             var directUserContent=userSubscriptions.filter(function(item) {
    
    
               var isInTimeStamp=item.timetstamp<
    
                return item.type == "DU" && ;
    
    
              }).map(item => item.content)
            */
            //Save result in table for faster queries -> future
            /*
              //Find Feed that belongs to user or create a new one
              var feed = await feedModel.findOne({ userid: userid_ }).exec();
              if (feed === undefined || feed === null) {
               feed = new feedModel({ userid: userid_ });
               await feed.save();
             }
    
             //Open FeedContent and insert
             var feedContent=feed["content"]
    
             //Get Raw String without object characteristics
               var stringIDs=questionsInFeed.map(function(entry) {
               return entry["_id"]
                 })
    
                 //Add the question IDs etc.
             feed = await feedModel
                 .findOneAndUpdate(
                   { userid: userid_ },
                   {
                     $addToSet: { content: stringIDs }
                   },
                   {
                     returnOriginal: false,
                     upsert: true
                   }
                 )
                 .exec();*/
        });
    }
    ;
    addQuestionToFeed(userid_, questionid) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield Feed_1.feedModel
                .findOneAndUpdate({ userid: userid_ }, {
                $setOnInsert: { userid: userid_ },
                $addToSet: { content: "Q" + questionid }
            }, {
                //returnOriginal: false,
                upsert: true
            })
                .exec();
            // const newOrUpdatedDocument = result.value;
        });
    }
    ;
}
exports.FeedLoader = FeedLoader;
//# sourceMappingURL=FeedLoader.js.map