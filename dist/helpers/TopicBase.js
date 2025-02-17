"use strict";
/**
 * Class used to manage the topics and creating special topics
 */
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
/**
 * Enum describing the possible flags a topics can carry
 */
const perf_hooks_1 = require("perf_hooks");
const Topic_1 = require("../models/Topic");
const TopicSnapshot_1 = require("../models/TopicSnapshot");
const Constants_1 = require("./Constants");
class TopicBase {
    /**
     * Special Topics -> Containers for multiple single topics, managed with flags
     */
    getSpecialTopics(type) {
        return __awaiter(this, void 0, void 0, function* () {
            const query = {};
            query["enabled"] = true;
            query["flag"] = type; //Special Topic Identifier
            return Topic_1.topicModel
                .find(query)
                .select("_id")
                .lean()
                .exec();
        });
    }
    getAllTopics() {
        return __awaiter(this, void 0, void 0, function* () {
            return Topic_1.topicModel.find({ enabled: true }).exec();
        });
    }
    getAllTopicIDs() {
        return __awaiter(this, void 0, void 0, function* () {
            return Topic_1.topicModel.find({ enabled: true }).select("_id").lean().exec();
        });
    }
    getAllParentTopicIDs() {
        return __awaiter(this, void 0, void 0, function* () {
            return Topic_1.topicModel.find({ enabled: true, parent: "-1" }).select("_id").lean().exec();
        });
    }
    changeTopicFlag(topicID, flag_) {
        return __awaiter(this, void 0, void 0, function* () {
            Topic_1.topicModel
                .findByIdAndUpdate(topicID, { "flag": [flag_] })
                .exec();
        });
    }
    /**
     * To generate a list of topcis on the db
     */
    createTopics() {
        return __awaiter(this, void 0, void 0, function* () {
            const colors = [
                "#212121",
                "#795548",
                "#009688",
                "#5677fc",
                "#673ab7",
                "#607d8b",
                "#9e9e9e",
                "#00bcd4",
                "#03a9f4",
                "#ffeb3b",
                "#9c27b0",
                "#e51c23",
                "#ff9800",
                "#cddc39",
                "#259b24",
                "#e91e63",
                "#ff5722",
                "#ffc107",
                "#ffeb3b",
                "#8bc34a"
            ];
            const content = [
                ["Cars", "Buy", "Sell", "Tune", "Accidents"],
                ["Music", "Rock", "Pop", "Metal", "Classic"],
                ["Books", "Novels", "Sci-Fi", "Shortbooks", "Audiobooks"],
                ["Programming", "Kotlin", "Java", "C++", "C#", "Python", "Swift"],
                ["Art", "Paintings", "Designs"],
                ["Lifestyle", "Cloths", "Make-Up", "Fitness", "Food"],
                ["Games", "Shooter", "Strategy", "MMORPG", "RPG"],
                ["Movies", "Action", "Horror", "Love", "Comedy"],
                [
                    "Education",
                    "Physics",
                    "Chemistry",
                    "Biology",
                    "Math",
                    "History",
                    "Sociology"
                ],
                ["Software", "Windows", "iOS", "Linux"],
                [
                    "Hardware",
                    "Mainboard",
                    "RAM",
                    "GPU",
                    "CPU",
                    "HDD",
                    "SDD",
                    "PCI Extensions",
                    "Fans",
                    "Tuning"
                ],
                ["Animals", "Dogs", "Cats", "Snakes", "Spiders", "Other Animals"],
                ["Jobs", "Career", "Firing"],
                ["Other", "Fun", "Stories", "Compliments"],
                ["Nature", "Traveling", "Exploring"],
                ["Countries", "Europe", "America", "Africa", "Asia", "Australia"]
            ];
            const contentSize = content.length;
            yield Topic_1.topicModel.remove({}).exec();
            console.log("Topic Creation started!");
            const startTime = perf_hooks_1.performance.now();
            for (let i = 0; i < contentSize; i++) {
                const subArraySize = content[i].length;
                const tagHeader = content[i][0];
                const cat1 = new Topic_1.topicModel({
                    _id: "yy" + i,
                    name: tagHeader,
                    enabled: true,
                    parent: "-1",
                    baseColor: colors[i]
                });
                yield cat1.save();
                for (let j = 1; j < subArraySize; j++) {
                    const subcat1 = new Topic_1.topicModel({
                        _id: "y" + i + "y" + j,
                        name: content[i][j],
                        enabled: true,
                        parent: cat1._id,
                        color: colors[i]
                    });
                    yield subcat1.save();
                }
                console.log((i + 1) + "/" + contentSize + " Topic Created: " + cat1._id + "  TIME: " + (perf_hooks_1.performance.now() - startTime));
            }
        });
    }
    getSingleTopic(topicID) {
        return __awaiter(this, void 0, void 0, function* () {
            return Topic_1.topicModel.findById(topicID).lean().exec();
        });
    }
    //Topic Snapshots
    getSnapshot(req) {
        return __awaiter(this, void 0, void 0, function* () {
            return TopicSnapshot_1.topicSnapshotModel.find({ enabled: true, topicID: req.body.topicID }).lean().exec();
        });
    }
    getSnapshots(topicID) {
        return __awaiter(this, void 0, void 0, function* () {
            return TopicSnapshot_1.topicSnapshotModel
                .find({ enabled: true, topicID: topicID })
                .sort({ "createdAt": -1 })
                .limit(Constants_1.SNAPSHOTS_TOPICS)
                .lean()
                .exec();
        });
    }
    setScore(topicID, action) {
        return __awaiter(this, void 0, void 0, function* () {
            switch (action) {
                case "poll": {
                    this.updateScore(topicID, 1);
                    break;
                }
                case "vote": {
                    this.updateScore(topicID, Constants_1.REPUTATION_VOTE);
                }
            }
        });
    }
    updateScore(topicID, value) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield Topic_1.topicModel.findOneAndUpdate({ _id: topicID }, { $inc: { scoreOverall: value } }).exec();
        });
    }
    /**
     * Get details about this topic. For example: Number of questions in this topic, flag and description
     */
    getTopicDetails(topicID) {
        return __awaiter(this, void 0, void 0, function* () {
            const query = {};
            query["tags"] = { $in: topicID };
            query["enabled"] = true;
            const result = {};
            //Get topic:
            const topic = this.getSingleTopic(topicID);
            //Get the count
            const countResult = Topic_1.topicModel
                .find(query)
                .lean()
                .count()
                .exec();
            result["topic"] = yield topic; //Parallel
            result["count"] = yield countResult;
            return result;
        });
    }
}
exports.TopicBase = TopicBase;
//# sourceMappingURL=TopicBase.js.map