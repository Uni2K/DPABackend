import { Router } from "express";
import { express, pollBase, upload, userBase, feedLoader } from "../app";
import {
    avatarPath, ERROR_IMAGE_ACCESS,
    ERROR_IMAGE_UPLOAD_PARTS,
    ERROR_IMAGE_UPLOAD_SIZE, ERROR_IMAGE_UPLOAD_UNKNOWN,
    ERROR_USER_AUTH,
    ERROR_USER_UNKNOWN, ImagePurposes,
    REPUTATION_COMMENT,
    REPUTATION_REPORT,
    REQUEST_OK
} from "../helpers/Constants";
import { adjustReputation } from "../helpers/StatisticsBase";
import { imageModel } from "../models/Image";
const auth = require("../middleware/auth");
const {validatePoll} = require("../models/Poll");
const {validateUser} = require("../models/User")
const {validate} = require("../helpers/Validate")
const Joi = require('@hapi/joi');

/**
 * USER Express Router
 */
export = function (): Router {
    const router = express.Router();

    router.post("/users/signup", async (req, res) => {
        // Create a new user
        const error = await validateUser(req.body);
        if (error.error) {
            console.log(error.error)
            return res.status(422).json(error.error.details[0].message);
        }

        userBase.createUser(res, req).catch((error) => {
            console.log(error.message);
            res.status(error.message).send(error);
        }).then((result) => {
            res.status(REQUEST_OK).send(result);
        });

    });
    router.post("/users/createPoll", auth, async (req, res) => {
        const error = await validatePoll(req.body);
        if (error.error) {
            console.log(error.error)
            return res.status(422).json(error.error.details[0].message);
        }
        await pollBase.createPoll(req, res);
    });
    router.get("/users/feed", auth, async (req, res) => {

        const schema = Joi.object({
            user: Joi.object().required(),
            index: Joi.number().required(),
            pageSize: Joi.number().required(),
            direction: Joi.string().valid("asc", "desc")
        });
        const input = {
            user: req.body.user,
            index: parseInt(req.query.index),
            pageSize: parseInt(req.query.pageSize),
            direction: req.query.direction
        }
        await validate(schema, input, res);

        const data = await feedLoader.getFeed(req.body.user, parseInt(req.query.index), parseInt(req.query.pageSize), req.query.direction);

        if (data.length > 0) {
            res.status(200).json(data)
        }
        else {
            res.status(204).json();
        }

    });
    router.post("/data/snapshot", async (req, res) => {
        const schema = Joi.object({
            user: Joi.object().required()
        });
        await validate(schema, req.body, res);
        //User snapshot -> Statistics again
        userBase.getSnapshots(req).then((result) => {
            res.status(REQUEST_OK).send(result);
        }).catch((err) => {
            res.status(ERROR_USER_UNKNOWN).send(err);
        });

    });
    router.post("/users/me", auth, async (req, res) => {
        // View logged in user profile
        try {
            req.body.user.password = ""; //Dont send this infos to the client
            req.body.user.sessionTokens = [];
            const user = req.body.user;
            const token = req.token;
            res.status(REQUEST_OK).send({ user, token });
        } catch (error) {
            res.status(ERROR_USER_AUTH).send(error);
        }
    });
    router.post("/data/vote", async (req, res) => {
        const schema = Joi.object({
            poll: Joi.object().required(),
            indexOfAnswer: Joi.number().required(),
            user: Joi.object().required(),
        });

        await validate(schema, req, res);
        userBase.vote(req).catch((err) => {
            res.status(err.message).send(err.message);
        }
        ).then((result) => {
            res.status(REQUEST_OK).send(result);
        });
    });
    router.post("/users/block", auth, async (req, res) => {

        const schema = Joi.object({
            user: Joi.object().required(),
            blockedUser: Joi.object().required()
        });

        await validate(schema, req, res);

        userBase.block(req).catch((err) => {
            res.status(err.message).send(err.message);
        }
        ).then((result) => {
            res.status(REQUEST_OK).send(result);
        });
    });
    router.post("/users/unblock", auth, async (req, res) => {

        const schema = Joi.object({
            user: Joi.object().required(),
            blockedUser: Joi.object().required()
        });

        await validate(schema, req, res);

        userBase.unblock(req).catch((err) => {
            res.status(err.message).send(err.message);
        }
        ).then((result) => {
            res.status(REQUEST_OK).send(result);
        });
    });
    router.post("/users/getBlockedUser", auth, async (req, res) => {

        const schema = Joi.object({
            user: Joi.object().required(),
        });

        await validate(schema, req, res);
        userBase.getBlockedUser(req).catch((err) => {
            res.status(err.message).send(err.message);
        }
        ).then((result) => {
            res.status(REQUEST_OK).send(result);
        });
    });
    router.post('/users/getAvatar', async function (req, res) {
        const schema = Joi.object({
            user: Joi.object().required(),
        });

        await validate(schema, req, res);

        const user = req.body.user
        const image = await imageModel.findOne({ enabled: true, user: user, purpose: ImagePurposes.Avatar })

        if (image == null) {
            res.status(ERROR_IMAGE_ACCESS).send(ERROR_IMAGE_ACCESS)
            return
        }
        res.download(avatarPath + image.fileName, (err => {

        }))
    })
    router.post('/users/changeAvatar', async function (req, res) {

        const schema = Joi.object({
            user: Joi.object().required(),
        });

        await validate(schema, req, res);

        // let userID=req.body.user._id
        let userID = "5dc6e18122304238205eccba" //Example, for debuggin
        req.body.user = {}

        upload.single("avatarImage")(req, res, async function (err) {
            //TODO TEST!!
            //deal with the error(s)
            if (err) {
                switch (err.code) {
                    case "LIMIT_FILE_SIZE":
                        res.status(ERROR_IMAGE_UPLOAD_SIZE).send("ERROR_IMAGE_UPLOAD_SIZE");

                        break;
                    case "LIMIT_PART_COUNT":
                        res.status(ERROR_IMAGE_UPLOAD_PARTS).send("ERROR_IMAGE_UPLOAD_PARTS");

                        break;
                    default: res.status(ERROR_IMAGE_UPLOAD_UNKNOWN).send("ERROR_IMAGE_UPLOAD_UNKOWN");
                }
                console.log(err)
                return;
            }


            await imageModel.deleteMany({ user: userID, purpose: ImagePurposes.Avatar }).exec();
            const img = await new imageModel({
                user: userID,
                fileName: req.file.filename,
                purpose: ImagePurposes.Avatar
            }).save();
            req.body.user.avatarImage = img._id;
            // await req.body.user.save();
            req.body.user.password = "";
            req.body.user.sessionTokens = "";
            res.status(REQUEST_OK).send(req.body.user);

        });

    });
    router.post("/data/report", auth, async (req, res) => {

        const schema = Joi.object({
            user: Joi.object().required(),
            type: Joi.number().required(),
            target: Joi.number().target
        });

        await validate(schema, req, res);

        userBase.report(req).catch((err) => {
            res.status(err.message).send(err.message);
        }
        ).then((result) => {
            res.status(REQUEST_OK).send(result);
            adjustReputation(req.body.user, REPUTATION_REPORT);
        });
    });
    router.post("/data/comment", auth, async (req, res) => {

        const schema = Joi.object({
            user: Joi.object().required(),
            conversationID: Joi.string().required(),
            header: Joi.string().required(),
            content: Joi.string().required(),
            parentComment: Joi.object().required(),

        });

        await validate(schema, req, res);

        userBase.addComment(req).catch((err) => {
            res.status(err.message).send(err.message);
        }
        ).then((result) => {
            res.status(REQUEST_OK).send(result);
            adjustReputation(req.body.user, REPUTATION_COMMENT);
        });
    });
    router.post("/users/me/edit", auth, async (req, res) => {

        const schema = Joi.object({
            user: Joi.object().required(),
            avatarURL: Joi.string().required(),
            headerURL: Joi.string().required(),
            additionalURL: Joi.string().required(),
            description: Joi.string().required(),
            location: Joi.string().required()
        });

        await validate(schema, req, res);

        req.body.user.avatarURL = req.body.avatarURL;
        req.body.user.headerURL = req.body.headerURL;
        req.body.user.additionalURL = req.body.additionalURL;

        req.body.user.description = req.body.description;
        req.body.user.location = req.body.location;
        try {
            await req.body.user.save();
            req.body.user.password = ""; //Dont send this infos to the client
            req.body.user.tokens = "";
            const user = req.body.user;
            const token = req.token;
            res.send({ user, token });
        } catch (error) {
            res.status(500).send(error);
        }
    });
    router.post("/users/me/subscribe", auth, async (req, res) => {
        console.log(req.body.user._id)
        const schema = Joi.object({
            user: Joi.object().required(),
            content: Joi.object().required(),
            type: Joi.string().required()
        });

        await validate(schema, req.body, res);



        userBase.subscribe(req).catch((err) => {
            res.status(err.message).send(err.message);
        }
        ).then((result) => {
            res.status(REQUEST_OK).send(result);
        });

    });
    router.post("/users/me/unsubscribe", auth, async (req, res) => {

        const schema = Joi.object({
            user: Joi.object().required(),
            content: Joi.object().required(),
            type: Joi.string().required()
        });

        await validate(schema, req, res);

        userBase.unsubscribe(req).catch((err) => {
            res.status(err.message).send(err.message);
        }
        ).then((result) => {
            res.status(REQUEST_OK).send(result);
        });
    });
    router.post("/users/byID", async (req, res) => {

        const schema = Joi.object({
            userID: Joi.string().required()
        });

        await validate(schema, req, res);

        userBase.userByID(req).catch((error) => {
            console.log(error.message);
            res.status(error.message).send(error);
        }).then((result) => {
            res.status(REQUEST_OK).send(result);
        });

    });
    router.post("/users/me/logout", auth, async (req, res) => {

        //no validation, function will removed soon

        try {
            req.body.user.tokens = req.body.user.tokens.filter(token => {
                return token.token != req.token;
            });
            await req.body.user.save();
            res.send();
        } catch (error) {
            res.status(500).send(error);
        }
    });
    router.post("/users/me/logoutall", auth, async (req, res) => {

        //no validation, function will removed soon

        try {
            req.body.user.tokens.splice(0, req.body.user.tokens.length);
            await req.body.user.save();
            res.send();
        } catch (error) {
            res.status(500).send(error);
        }
    });
    router.post("/users/login", async (req, res) => {

        const schema = Joi.object({
            email: Joi.string().email().required(),
            password: Joi.string().required()
        });

        await validate(schema, req.body, res);

        userBase.login(req).catch((error) => {
            console.log(error.message);
            res.status(error.message).send(error);
        }).then((result) => {
            res.status(REQUEST_OK).send(result);
        });
    });
    return router;

};


