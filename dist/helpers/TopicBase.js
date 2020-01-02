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
var TopicFlags;
(function (TopicFlags) {
    TopicFlags[TopicFlags["Idle"] = 0] = "Idle";
    TopicFlags[TopicFlags["Recommended"] = 1] = "Recommended";
    TopicFlags[TopicFlags["Hot"] = 2] = "Hot";
    TopicFlags[TopicFlags["New"] = 3] = "New";
})(TopicFlags || (TopicFlags = {}));
class TopicBase {
    constructor(pollModel, userModel, topicModel) {
        this.userModel = userModel;
        this.pollModel = pollModel;
        this.topicModel = topicModel;
        // this.createTopics();
    }
    getSpecialTopics(type) {
        return __awaiter(this, void 0, void 0, function* () {
            const query = {};
            query["enabled"] = true;
            query["flag"] = type;
            return this.topicModel
                .find(query)
                .select("_id")
                .lean()
                .exec();
        });
    }
    getAllTopics() {
        return __awaiter(this, void 0, void 0, function* () {
            return this.topicModel.find({ enabled: true }).lean().exec();
        });
    }
    changeTopicFlag(topicID, flag_) {
        return __awaiter(this, void 0, void 0, function* () {
            this.topicModel
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
            yield this.topicModel.remove({}).exec();
            console.log("Topic Creation started!");
            const startTime = perf_hooks_1.performance.now();
            for (let i = 0; i < contentSize; i++) {
                const subArraySize = content[i].length;
                const tagHeader = content[i][0];
                const cat1 = new this.topicModel({
                    _id: "yy" + i,
                    name: tagHeader,
                    enabled: true,
                    parent: "-1",
                    baseColor: colors[i]
                });
                yield cat1.save();
                for (let j = 1; j < subArraySize; j++) {
                    const subcat1 = new this.topicModel({
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
            return this.topicModel.findById(topicID).lean().exec();
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
            const countResult = this.topicModel
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