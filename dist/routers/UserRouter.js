"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const app_1 = require("../app");
const Constants_1 = require("../helpers/Constants");
const StatisticsBase_1 = require("../helpers/StatisticsBase");
const Image_1 = require("../models/Image");
const auth = require("../middleware/auth");
const { validatePoll } = require("../models/Poll");
const { validateUser } = require("../models/User");
const { validate } = require("../helpers/Validate");
const Joi = require('@hapi/joi');
module.exports = function () {
    const router = app_1.express.Router();
    router.post("/users/signup", (req, res) => __awaiter(this, void 0, void 0, function* () {
        // Create a new user
        const error = yield validateUser(req.body);
        if (error.error) {
            console.log(error.error);
            return res.status(422).json(error.error.details[0].message);
        }
        app_1.userBase.createUser(res, req).catch((error) => {
            console.log(error.message);
            res.status(error.message).send(error);
        }).then((result) => {
            res.status(Constants_1.REQUEST_OK).send(result);
        });
    }));
    router.post("/users/createPoll", auth, (req, res) => __awaiter(this, void 0, void 0, function* () {
        // Create a new Poll
        const error = yield validatePoll(req.body);
        if (error.error) {
            console.log(error.error);
            return res.status(422).json(error.error.details[0].message);
        }
        yield app_1.pollBase.createPoll(req, res);
    }));
    router.get("/users/feed", auth, (req, res) => __awaiter(this, void 0, void 0, function* () {
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
        };
        yield validate(schema, input, res);
        const data = yield app_1.feedLoader.getFeed(req.body.user, parseInt(req.query.index), parseInt(req.query.pageSize), req.query.direction);
        if (data.length > 0) {
            res.status(200).json(data);
        }
        else {
            res.status(204).json();
        }
    }));
    router.post("/data/snapshot", (req, res) => __awaiter(this, void 0, void 0, function* () {
        const schema = Joi.object({
            user: Joi.object().required()
        });
        yield validate(schema, req.body, res);
        //User snapshot -> Statistics again
        app_1.userBase.getSnapshots(req).then((result) => {
            res.status(Constants_1.REQUEST_OK).send(result);
        }).catch((err) => {
            res.status(Constants_1.ERROR_USER_UNKNOWN).send(err);
        });
    }));
    router.post("/users/me", auth, (req, res) => __awaiter(this, void 0, void 0, function* () {
        // View logged in user profile
        try {
            req.body.user.password = ""; //Dont send this infos to the client
            req.body.user.sessionTokens = [];
            const user = req.body.user;
            const token = req.token;
            res.status(Constants_1.REQUEST_OK).send({ user, token });
        }
        catch (error) {
            res.status(Constants_1.ERROR_USER_AUTH).send(error);
        }
    }));
    router.post("/data/vote", (req, res) => __awaiter(this, void 0, void 0, function* () {
        const schema = Joi.object({
            poll: Joi.object().required(),
            indexOfAnswer: Joi.number().required(),
            user: Joi.object().required(),
        });
        yield validate(schema, req, res);
        app_1.userBase.vote(req).catch((err) => {
            res.status(err.message).send(err.message);
        }).then((result) => {
            res.status(Constants_1.REQUEST_OK).send(result);
        });
    }));
    router.post("/users/block", auth, (req, res) => __awaiter(this, void 0, void 0, function* () {
        const schema = Joi.object({
            user: Joi.object().required(),
            blockedUser: Joi.object().required()
        });
        yield validate(schema, req, res);
        app_1.userBase.block(req).catch((err) => {
            res.status(err.message).send(err.message);
        }).then((result) => {
            res.status(Constants_1.REQUEST_OK).send(result);
        });
    }));
    router.post("/users/unblock", auth, (req, res) => __awaiter(this, void 0, void 0, function* () {
        const schema = Joi.object({
            user: Joi.object().required(),
            blockedUser: Joi.object().required()
        });
        yield validate(schema, req, res);
        app_1.userBase.unblock(req).catch((err) => {
            res.status(err.message).send(err.message);
        }).then((result) => {
            res.status(Constants_1.REQUEST_OK).send(result);
        });
    }));
    router.post("/users/getBlockedUser", auth, (req, res) => __awaiter(this, void 0, void 0, function* () {
        const schema = Joi.object({
            user: Joi.object().required(),
        });
        yield validate(schema, req, res);
        app_1.userBase.getBlockedUser(req).catch((err) => {
            res.status(err.message).send(err.message);
        }).then((result) => {
            res.status(Constants_1.REQUEST_OK).send(result);
        });
    }));
    router.post('/users/getAvatar', function (req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const schema = Joi.object({
                user: Joi.object().required(),
            });
            yield validate(schema, req, res);
            const user = req.body.user;
            const image = yield Image_1.imageModel.findOne({ enabled: true, user: user, purpose: Constants_1.ImagePurposes.Avatar });
            if (image == null) {
                res.status(Constants_1.ERROR_IMAGE_ACCESS).send(Constants_1.ERROR_IMAGE_ACCESS);
                return;
            }
            res.download(Constants_1.avatarPath + image.fileName, (err => {
            }));
        });
    });
    router.post('/users/changeAvatar', function (req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const schema = Joi.object({
                user: Joi.object().required(),
            });
            yield validate(schema, req, res);
            // let userID=req.body.user._id
            let userID = "5dc6e18122304238205eccba"; //Example, for debuggin
            req.body.user = {};
            app_1.upload.single("avatarImage")(req, res, function (err) {
                return __awaiter(this, void 0, void 0, function* () {
                    //TODO TEST!!
                    //deal with the error(s)
                    if (err) {
                        switch (err.code) {
                            case "LIMIT_FILE_SIZE":
                                res.status(Constants_1.ERROR_IMAGE_UPLOAD_SIZE).send("ERROR_IMAGE_UPLOAD_SIZE");
                                break;
                            case "LIMIT_PART_COUNT":
                                res.status(Constants_1.ERROR_IMAGE_UPLOAD_PARTS).send("ERROR_IMAGE_UPLOAD_PARTS");
                                break;
                            default: res.status(Constants_1.ERROR_IMAGE_UPLOAD_UNKNOWN).send("ERROR_IMAGE_UPLOAD_UNKOWN");
                        }
                        console.log(err);
                        return;
                    }
                    yield Image_1.imageModel.deleteMany({ user: userID, purpose: Constants_1.ImagePurposes.Avatar }).exec();
                    const img = yield new Image_1.imageModel({
                        user: userID,
                        fileName: req.file.filename,
                        purpose: Constants_1.ImagePurposes.Avatar
                    }).save();
                    req.body.user.avatarImage = img._id;
                    // await req.body.user.save();
                    req.body.user.password = "";
                    req.body.user.sessionTokens = "";
                    res.status(Constants_1.REQUEST_OK).send(req.body.user);
                });
            });
        });
    });
    router.post("/data/report", auth, (req, res) => __awaiter(this, void 0, void 0, function* () {
        const schema = Joi.object({
            user: Joi.object().required(),
            type: Joi.number().required(),
            target: Joi.number().target
        });
        yield validate(schema, req, res);
        app_1.userBase.report(req).catch((err) => {
            res.status(err.message).send(err.message);
        }).then((result) => {
            res.status(Constants_1.REQUEST_OK).send(result);
            StatisticsBase_1.adjustReputation(req.body.user, Constants_1.REPUTATION_REPORT);
        });
    }));
    router.post("/data/comment", auth, (req, res) => __awaiter(this, void 0, void 0, function* () {
        const schema = Joi.object({
            user: Joi.object().required(),
            conversationID: Joi.string().required(),
            header: Joi.string().required(),
            content: Joi.string().required(),
            parentComment: Joi.object().required(),
        });
        yield validate(schema, req, res);
        app_1.userBase.addComment(req).catch((err) => {
            res.status(err.message).send(err.message);
        }).then((result) => {
            res.status(Constants_1.REQUEST_OK).send(result);
            StatisticsBase_1.adjustReputation(req.body.user, Constants_1.REPUTATION_COMMENT);
        });
    }));
    router.post("/users/me/edit", auth, (req, res) => __awaiter(this, void 0, void 0, function* () {
        const schema = Joi.object({
            user: Joi.object().required(),
            avatarURL: Joi.string().required(),
            headerURL: Joi.string().required(),
            additionalURL: Joi.string().required(),
            description: Joi.string().required(),
            location: Joi.string().required()
        });
        yield validate(schema, req, res);
        req.body.user.avatarURL = req.body.avatarURL;
        req.body.user.headerURL = req.body.headerURL;
        req.body.user.additionalURL = req.body.additionalURL;
        req.body.user.description = req.body.description;
        req.body.user.location = req.body.location;
        try {
            yield req.body.user.save();
            req.body.user.password = ""; //Dont send this infos to the client
            req.body.user.tokens = "";
            const user = req.body.user;
            const token = req.token;
            res.send({ user, token });
        }
        catch (error) {
            res.status(500).send(error);
        }
    }));
    router.post("/users/me/subscribe", auth, (req, res) => __awaiter(this, void 0, void 0, function* () {
        const schema = Joi.object({
            user: Joi.object().required(),
            content: Joi.object().required(),
            type: Joi.string().required()
        });
        yield validate(schema, req, res);
        app_1.userBase.subscribe(req).catch((err) => {
            res.status(err.message).send(err.message);
        }).then((result) => {
            res.status(Constants_1.REQUEST_OK).send(result);
        });
    }));
    router.post("/users/me/unsubscribe", auth, (req, res) => __awaiter(this, void 0, void 0, function* () {
        const schema = Joi.object({
            user: Joi.object().required(),
            content: Joi.object().required(),
            type: Joi.string().required()
        });
        yield validate(schema, req, res);
        app_1.userBase.unsubscribe(req).catch((err) => {
            res.status(err.message).send(err.message);
        }).then((result) => {
            res.status(Constants_1.REQUEST_OK).send(result);
        });
    }));
    router.post("/users/byID", (req, res) => __awaiter(this, void 0, void 0, function* () {
        const schema = Joi.object({
            userID: Joi.string().required()
        });
        yield validate(schema, req, res);
        app_1.userBase.userByID(req).catch((error) => {
            console.log(error.message);
            res.status(error.message).send(error);
        }).then((result) => {
            res.status(Constants_1.REQUEST_OK).send(result);
        });
    }));
    router.post("/users/me/logout", auth, (req, res) => __awaiter(this, void 0, void 0, function* () {
        //no validation, function will removed soon
        try {
            req.body.user.tokens = req.body.user.tokens.filter(token => {
                return token.token != req.token;
            });
            yield req.body.user.save();
            res.send();
        }
        catch (error) {
            res.status(500).send(error);
        }
    }));
    router.post("/users/me/logoutall", auth, (req, res) => __awaiter(this, void 0, void 0, function* () {
        //no validation, function will removed soon
        try {
            req.body.user.tokens.splice(0, req.body.user.tokens.length);
            yield req.body.user.save();
            res.send();
        }
        catch (error) {
            res.status(500).send(error);
        }
    }));
    router.post("/users/login", (req, res) => __awaiter(this, void 0, void 0, function* () {
        const schema = Joi.object({
            email: Joi.string().email().required(),
            password: Joi.string().required()
        });
        yield validate(schema, req, res);
        app_1.userBase.login(req).catch((error) => {
            console.log(error.message);
            res.status(error.message).send(error);
        }).then((result) => {
            res.status(Constants_1.REQUEST_OK).send(result);
        });
    }));
    return router;
};
//# sourceMappingURL=UserRouter.js.map