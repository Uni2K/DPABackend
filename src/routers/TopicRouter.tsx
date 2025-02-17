import {express, pollBase, specialTopics, topicBase, trendingTopics} from "../app";
import {ERROR_USER_UNKNOWN, REQUEST_OK} from "../helpers/Constants";
import {TrendingTopicsBase} from "../helpers/TrendingTopicsBase";
import auth = require("../middleware/auth");
const {validate} = require("../helpers/Validate")
const Joi = require('@hapi/joi');

export = function() {
    const router = express.Router();
    router.post("/topics/all", async (req, res) => {

        const result = await topicBase.getAllTopics()
        res.status(200).send(result);
    });
    router.post("/topics/details", async (req, res) => {

        const schema = Joi.object({
            topic: Joi.array().required(),

        });
        await validate(schema, req, res);

        const topicID = req.body.topic;
        const result = await topicBase.getTopicDetails(topicID)
        res.status(200).send(result);

    });
    router.post("/topics/snapshot", async (req, res) => {

        const schema = Joi.object({
            topicID: Joi.array().required(),

        });
        await validate(schema, req, res);

        topicBase.getSnapshots(req).then((result)=>{
            res.status(REQUEST_OK).send(result)
        }).catch((err)=>{
            res.status(ERROR_USER_UNKNOWN).send(err)
        })

    });
    router.get("/topics/trending", auth, async (req, res) => {
        res.status(200).json(await trendingTopics.getTrendingTopics())
    });
    router.get("/topics/special/all", auth, async (req, res) => {
        res.status(200).json( await specialTopics.getAllTopics());
    });
    router.post("/topics/special/create", auth, async (req, res) => {
        const schema = Joi.object({
            user: Joi.object().required(),
            name: Joi.string().required()
        });
        await validate(schema, req.body, res);

        res.status(200).json( await specialTopics.createSpecialTopic(req));
    });
    router.get("/topics/specialItem/all", auth, async (req, res) => {

        const schema = Joi.object({
            specialTopicID: Joi.string().required()
        });
        await validate(schema, req.query, res);

        res.status(200).json( await specialTopics.getAllItems(req.query.specialTopicID));
    });
    router.post("/topics/specialItem/create", auth, async (req, res) => {
        const schema = Joi.object({
            user: Joi.object(),
            topicID: Joi.string().required(),
            specialTopicID: Joi.string().required()
        });
        await validate(schema, req.body, res);

        res.status(200).json( await specialTopics.createItem(req));
    });
    //createTag()
    return router;
};



