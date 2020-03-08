import {express, pollBase, userBase} from "../app";
import {ERROR_USER_UNKNOWN, REQUEST_OK} from "../helpers/Constants";
import {snapshotBase} from "../app";
const {validate} = require("../helpers/Validate")
const Joi = require('@hapi/joi');

export = function() {
    const router = express.Router();

    router.post("/polls/byIDs", async (req, res) => {

        const schema = Joi.object({
            pollIDs: Joi.array().required()
        });

        await validate(schema, req, res);

        const ids = req.body.ids;
        pollBase.getPollsByIds(ids).then((result)=>{
            res.status(REQUEST_OK).send(result)
        }).catch((err)=>{
            res.status(ERROR_USER_UNKNOWN).send(err)
        })

    });
    router.post("/polls/search", async (req, res) => {

        const schema = Joi.object({
            index: Joi.number().required(),
            pageSize: Joi.number().required(),
            topics: Joi.array(),
            voteMinimum: Joi.number(),
            searchText: Joi.string().required(),
        });

        await validate(schema, req, res);

        pollBase.searchPolls(req).then((result)=>{
            res.status(REQUEST_OK).send(result)
        }).catch((err)=>{
            res.status(ERROR_USER_UNKNOWN).send(err)
        })

    });
    //For statistics reason
    router.post("/polls/snapshot", async (req, res) => {

        const schema = Joi.object({
            pollID: Joi.string().required()
        });

        await validate(schema, req, res);

        snapshotBase.getPollSnapshots(req).then((result)=>{
            res.status(REQUEST_OK).send(result)
        }).catch((err)=>{
            res.status(ERROR_USER_UNKNOWN).send(err)
        })

    });
    //For the creator
    router.post("/data/creation/metadata", async (req, res) => {
            res.status(REQUEST_OK).send(pollBase.getCreationMetadata())
    });
    return router;
};
