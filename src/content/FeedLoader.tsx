const feedModel = require("../models/Feed");
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


export class FeedLoader {
    private userModel;
    private pollModel;
    private topicModel;


    constructor(pollModel, userModel, topicModel) {
        this.userModel=userModel
       this.pollModel=pollModel
        this.topicModel=topicModel
    }


    async getFeed (res, userid_, loadsize, index, older) {
        // Find User to get his Subscriptions
        const user = await this.userModel
            .findById({
                _id: userid_
            })
            .lean()
            .select("subscriptions")
            .exec()

        const userSubscriptions = user["subscriptions"];

        //Filter the user subscriptions by their types: T-> Question from Topic Subscription, U-> Question From User Subscription
        const topicContent = userSubscriptions.filter(function(item) {
            return item.type == "T";
        }).map(item => item.content);
        const userContent = userSubscriptions.filter(function(item) {
            return item.type == "U";
        }).map(item => item.content);

        //Fetch Content
        const query = {};
        query["enabled"] = true;
        if (older) {
            query["timestamp"] = {$lt: index};
        } else query["timestamp"] = {$gt: index};

        query["$or"] = [{userid: {$in: userContent}}, {tags: {$in: topicContent}}]

        const questionsInFeed = await this.pollModel
            .find(query)
            //.select("_id")
            .sort({timestamp: -1})
            .limit(loadsize)
            .populate("tags", this.topicModel)
            .populate("userid", "name avatar")
            .lean()
            .exec();
        console.log("GET FEED Config: " + userid_ + " " + loadsize + " " + older + "  " + index + "  " + questionsInFeed.length)

        res.status(200).send(questionsInFeed)

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

    };

    async addQuestionToFeed(userid_, questionid) {
        const result = await feedModel
            .findOneAndUpdate(
                {userid: userid_},
                {
                    $setOnInsert: {userid: userid_},
                    $addToSet: {content: "Q" + questionid}
                },
                {
                    returnOriginal: false,
                    upsert: true
                }
            )
            .exec();

        const newOrUpdatedDocument = result.value;
    };
}
