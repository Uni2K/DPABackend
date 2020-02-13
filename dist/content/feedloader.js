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
//import {feedModel} from "../models/Feed";
const Content_1 = require("../models/Content");
const FeedPool_1 = require("../models/FeedPool");
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
const app_1 = require("../app");
class FeedLoader {
    /**
     * Create Items for the feed
     */
    createFeed(userID, amount) {
        return __awaiter(this, void 0, void 0, function* () {
            // Items with the highest priority and the latest creation date are sent first. Priority > Creation Date
            let feedItems = yield Content_1.contentModel
                .find({ user: userID })
                .sort({ priority: -1 })
                .sort({ "created_at": -1 })
                .limit(amount)
                .exec();
            let index = yield FeedPool_1.feedModel
                .findOne({ user: userID })
                .sort({ index: -1 })
                .select("index -_id");
            let resultIndex = 0;
            if (index) {
                resultIndex = index.index + 1;
            }
            let data = [];
            for (let i = 0; i < feedItems.length; i++) {
                data.push(yield app_1.poolBase.createFeedItem(feedItems[i], resultIndex + i));
            }
            return data;
        });
    }
    /**
     * Returns Feed from a certain index
     */
    getFeed(userID, index, pageSize, direction) {
        return __awaiter(this, void 0, void 0, function* () {
            let border;
            console.log(userID);
            if (direction == "asc") {
                border = index + pageSize;
            }
            else {
                border = index - pageSize;
            }
            let counter = yield FeedPool_1.feedModel.find({ user: userID, index: { $lt: border + 1, $gt: index - 1 } }).sort({ index: 1 }).countDocuments();
            if (counter < pageSize) {
                yield this.createFeed(userID, pageSize - counter);
            }
            if (direction == "asc") {
                return FeedPool_1.feedModel.find({ user: userID, index: { $lt: border, $gt: index - 1 } }).sort({ index: 1 });
            }
            else {
                return FeedPool_1.feedModel.find({ user: userID, index: { $lt: index + 1, $gt: border } }).sort({ index: -1 });
            }
        });
    }
}
exports.FeedLoader = FeedLoader;
//# sourceMappingURL=FeedLoader.js.map