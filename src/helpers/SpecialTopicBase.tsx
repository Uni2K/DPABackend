import {topicSpecialItemModel, topicSpecialModel} from "../models/TopicSpecial";

export class SpecialTopic {

    async getAllTopics() {
        return topicSpecialModel.find({}).exec();

    }
    async getByID(specialTopicID){
        return topicSpecialModel.find({_id: specialTopicID}).exec();
    }

    async createSpecialTopic(req){
        return new topicSpecialModel(req.body).save();
    }

    async getAllItems(specialTopicID){
        console.log(specialTopicID)
        return topicSpecialItemModel.find({specialTopicID: specialTopicID}).select("topicID").exec();
    }

    async createItem(req) {
        return new topicSpecialItemModel(req.body).save();
    }

}
