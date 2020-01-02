import {TopicBase} from "../helpers/TopicBase";

export = function(topicBase:TopicBase,pollModel,userModel,topicModel,express) {
    const router = express.Router();
    router.post("/topics/all", async (req, res) => {

        const result = await topicBase.getAllTopics()
        res.status(200).send(result);
    });

    router.post("/topics/details", async (req, res) => {
        const topicID = req.body.topic;
        const result = await topicBase.getTopicDetails(topicID)
        res.status(200).send(result);

    });



    //createTag()
    return router;
};



