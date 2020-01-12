import {express, pollBase, topicBase} from "../app";
import {ERROR_USER_UNKNOWN, REQUEST_OK} from "../helpers/Constants";
import {TopicBase} from "../helpers/TopicBase";

export = function() {
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
    router.post("/topics/snapshot", async (req, res) => {
        topicBase.getSnapshots(req).then((result)=>{
            res.status(REQUEST_OK).send(result)
        }).catch((err)=>{
            res.status(ERROR_USER_UNKNOWN).send(err)
        })

    });


    //createTag()
    return router;
};



