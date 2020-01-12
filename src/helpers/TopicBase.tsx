/**
 * Class used to manage the topics and creating special topics
 */

/**
 * Enum describing the possible flags a topics can carry
 */
import {performance} from 'perf_hooks';
import {pollSnapshotModel} from "../models/PollSnapshot";
import {topicModel} from "../models/Topic";
import {topicSnapshotModel} from "../models/TopicSnapshot";

enum TopicFlags {
    Idle,
    Recommended,
    Hot,
    New
}

export class TopicBase {

    async getSpecialTopics(type: number): Promise<any> {
        const query = {};
        query["enabled"] = true;
        query["flag"] = type;
        return topicModel
            .find(query)
            .select("_id")
            .lean()
            .exec();
    }

    async getAllTopics() {
        return topicModel.find({enabled: true}).lean().exec();
    }
    async getAllTopicIDs() {
        return topicModel.find({enabled: true}).select("_id").lean().exec();
    }
    async getAllParentTopicIDs() {
        return topicModel.find({enabled: true, parent: "-1"}).select("_id").lean().exec();
    }
    async changeTopicFlag(topicID: string, flag_: number) {
        topicModel
            .findByIdAndUpdate(topicID, {"flag": [flag_]})
            .exec();
    }

    /**
     * To generate a list of topcis on the db
     */
    async createTopics() {
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
        await topicModel.remove({}).exec();
        console.log("Topic Creation started!");
        const startTime = performance.now();
        for (let i = 0; i < contentSize; i++) {
            const subArraySize = content[i].length;
            const tagHeader = content[i][0];
            const cat1 = new topicModel({
                _id: "yy" + i,
                name: tagHeader,
                enabled: true,
                parent: "-1",
                baseColor: colors[i]
            });

            await cat1.save();
            for (let j = 1; j < subArraySize; j++) {

                const subcat1 = new topicModel({
                    _id: "y" + i + "y" + j,
                    name: content[i][j],
                    enabled: true,
                    parent: cat1._id,
                    color: colors[i]
                });
                await subcat1.save();

            }

            console.log((i + 1) + "/" + contentSize + " Topic Created: " + cat1._id + "  TIME: " + (performance.now() - startTime));
        }

    }

    async getSingleTopic(topicID: string) {
        return topicModel.findById(topicID).lean().exec();
    }

    async getSnapshots(req){
        return topicSnapshotModel.find({enabled:true, topicid:req.body.topicid}).lean().exec()
    }


    /**
     * Get details about this topic. For example: Number of questions in this topic, flag and description
     */
    async getTopicDetails(topicID: string) {
        const query = {};
        query["tags"] = {$in: topicID};
        query["enabled"] = true;

        const result = {};

        //Get topic:
        const topic = this.getSingleTopic(topicID);

        //Get the count
        const countResult = topicModel
            .find(query)
            .lean()
            .count()
            .exec();

        result["topic"] = await topic;   //Parallel
        result["count"] = await countResult;
        return result;

    }
}
