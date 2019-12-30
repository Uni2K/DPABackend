const statRoutines=require("../helpers/StatisticsBase");

export = function(pollModel,userModel,topicModel,express) {
    const router = express.Router();

    router.post("/questions/byIDs", async (req, res) => {
        const ids = req.body.ids;
        const questions = await pollModel
            .find({_id: {$in: ids}})
            .populate("tags", topicModel)
            .populate("userid", "name avatar _id")
            .exec();

        res.status(200).send(questions)


    });



    router.post("/questions/simple", async (req, res) => {
        const loadSize = req.body.loadSize;
        const searchQuery = req.body.searchQuery;
        const key = req.body.key;
        const older = req.body.older;
        const userid = req.body.userid;

        const query = {};
        query["enabled"] = true;
        if(searchQuery){
            if (searchQuery.length > 0) {
                query["text"] = { $regex: searchQuery};
            }
        }
        if(userid){
            query["userid"] = userid ;
        }
        if (key != "-1") {
            if (!older) query["timestamp"] = { $gt: key };
            else query["timestamp"] = { $lt: key };
        }
        const questions = await pollModel
            .find(query)
            .sort({timestamp: -1})
            .limit(loadSize)
            .populate("tags", topicModel)
            .populate("userid", "name avatar _id")
            .exec();

        res.status(200).send(questions)

    });

    return router;
};
