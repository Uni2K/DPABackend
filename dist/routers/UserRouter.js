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
const PoolBase_1 = require("../helpers/PoolBase");
const StatisticsBase_1 = require("../helpers/StatisticsBase");
const Image_1 = require("../models/Image");
const auth = require("../middleware/auth");
module.exports = function () {
    const router = app_1.express.Router();
    router.post("/users/signup", (req, res) => __awaiter(this, void 0, void 0, function* () {
        // Create a new user
        app_1.userBase.createUser(res, req).catch((error) => {
            console.log(error.message);
            res.status(error.message).send(error);
        }).then((result) => {
            res.status(Constants_1.REQUEST_OK).send(result);
        });
    }));
    router.post("/users/createPoll", auth, (req, res) => __awaiter(this, void 0, void 0, function* () {
        // Create a new user
        yield app_1.pollBase.createPoll(req, res);
    }));
    router.get("/users/feed", auth, (req, res) => __awaiter(this, void 0, void 0, function* () {
        const feedCreation = new PoolBase_1.PoolBase();
        const data = yield feedCreation.getItemsForFeed(req.user, parseInt(req.query.amount));
        if (data.length > 0) {
            res.status(200).json(data);
        }
        else {
            res.status(204).json();
        }
    }));
    router.get("/users/restoreFeed", auth, (req, res) => __awaiter(this, void 0, void 0, function* () {
        const feedCreation = new PoolBase_1.PoolBase();
        const data = yield feedCreation.restoreFeed(req.user, parseInt(req.query.index), parseInt(req.query.count), req.query.asc);
        res.status(200).json(data);
    }));
    router.post("/data/snapshot", (req, res) => __awaiter(this, void 0, void 0, function* () {
        app_1.userBase.getSnapshots(req).then((result) => {
            res.status(Constants_1.REQUEST_OK).send(result);
        }).catch((err) => {
            res.status(Constants_1.ERROR_USER_UNKNOWN).send(err);
        });
    }));
    router.post("/users/me", auth, (req, res) => __awaiter(this, void 0, void 0, function* () {
        // View logged in user profile
        try {
            req.user.password = ""; //Dont send this infos to the client
            req.user.sessionTokens = [];
            const user = req.user;
            const token = req.token;
            res.status(Constants_1.REQUEST_OK).send({ user, token });
        }
        catch (error) {
            res.status(Constants_1.ERROR_USER_AUTH).send(error);
        }
    }));
    router.post("/data/vote", (req, res) => __awaiter(this, void 0, void 0, function* () {
        app_1.userBase.vote(req).catch((err) => {
            res.status(err.message).send(err.message);
        }).then((result) => {
            res.status(Constants_1.REQUEST_OK).send(result);
        });
    }));
    router.post("/users/block", auth, (req, res) => __awaiter(this, void 0, void 0, function* () {
        app_1.userBase.block(req).catch((err) => {
            res.status(err.message).send(err.message);
        }).then((result) => {
            res.status(Constants_1.REQUEST_OK).send(result);
        });
    }));
    router.post("/users/unblock", auth, (req, res) => __awaiter(this, void 0, void 0, function* () {
        app_1.userBase.unblock(req).catch((err) => {
            res.status(err.message).send(err.message);
        }).then((result) => {
            res.status(Constants_1.REQUEST_OK).send(result);
        });
    }));
    router.post("/users/getBlockedUser", auth, (req, res) => __awaiter(this, void 0, void 0, function* () {
        app_1.userBase.getBlockedUser(req).catch((err) => {
            res.status(err.message).send(err.message);
        }).then((result) => {
            res.status(Constants_1.REQUEST_OK).send(result);
        });
    }));
    router.post('/users/getAvatar', function (req, res) {
        return __awaiter(this, void 0, void 0, function* () {
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
            // let userid=req.user._id
            let userid = "5dc6e18122304238205eccba";
            req.user = {};
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
                    yield Image_1.imageModel.deleteMany({ user: userid, purpose: Constants_1.ImagePurposes.Avatar }).exec();
                    const img = yield new Image_1.imageModel({
                        user: userid,
                        fileName: req.file.filename,
                        purpose: Constants_1.ImagePurposes.Avatar
                    }).save();
                    req.user.avatarImage = img._id;
                    // await req.user.save();
                    req.user.password = "";
                    req.user.sessionTokens = "";
                    res.status(Constants_1.REQUEST_OK).send(req.user);
                });
            });
        });
    });
    router.post("/data/report", auth, (req, res) => __awaiter(this, void 0, void 0, function* () {
        app_1.userBase.report(req).catch((err) => {
            res.status(err.message).send(err.message);
        }).then((result) => {
            res.status(Constants_1.REQUEST_OK).send(result);
            StatisticsBase_1.adjustReputation(req.user, Constants_1.REPUTATION_REPORT);
        });
    }));
    router.post("/data/comment", auth, (req, res) => __awaiter(this, void 0, void 0, function* () {
        app_1.userBase.addComment(req).catch((err) => {
            res.status(err.message).send(err.message);
        }).then((result) => {
            res.status(Constants_1.REQUEST_OK).send(result);
            StatisticsBase_1.adjustReputation(req.user, Constants_1.REPUTATION_COMMENT);
        });
    }));
    router.post("/users/me/edit", auth, (req, res) => __awaiter(this, void 0, void 0, function* () {
        req.user.avatarURL = req.body.avatarURL;
        req.user.headerURL = req.body.headerURL;
        req.user.additionalURL = req.body.additionalURL;
        req.user.description = req.body.description;
        req.user.location = req.body.location;
        try {
            yield req.user.save();
            req.user.password = ""; //Dont send this infos to the client
            req.user.tokens = "";
            const user = req.user;
            const token = req.token;
            res.send({ user, token });
        }
        catch (error) {
            res.status(500).send(error);
        }
    }));
    router.post("/users/me/", auth, (req, res) => __awaiter(this, void 0, void 0, function* () {
        app_1.userBase.subscribe(req).catch((err) => {
            res.status(err.message).send(err.message);
        }).then((result) => {
            res.status(Constants_1.REQUEST_OK).send(result);
        });
    }));
    router.post("/users/me/unsubscribe", auth, (req, res) => __awaiter(this, void 0, void 0, function* () {
        app_1.userBase.unsubscribe(req).catch((err) => {
            res.status(err.message).send(err.message);
        }).then((result) => {
            res.status(Constants_1.REQUEST_OK).send(result);
        });
    }));
    router.post("/users/byID", (req, res) => __awaiter(this, void 0, void 0, function* () {
        app_1.userBase.userByID(req).catch((error) => {
            console.log(error.message);
            res.status(error.message).send(error);
        }).then((result) => {
            res.status(Constants_1.REQUEST_OK).send(result);
        });
    }));
    router.post("/users/me/logout", auth, (req, res) => __awaiter(this, void 0, void 0, function* () {
        try {
            req.user.tokens = req.user.tokens.filter(token => {
                return token.token != req.token;
            });
            yield req.user.save();
            res.send();
        }
        catch (error) {
            res.status(500).send(error);
        }
    }));
    router.post("/users/me/logoutall", auth, (req, res) => __awaiter(this, void 0, void 0, function* () {
        try {
            req.user.tokens.splice(0, req.user.tokens.length);
            yield req.user.save();
            res.send();
        }
        catch (error) {
            res.status(500).send(error);
        }
    }));
    router.post("/users/login", (req, res) => __awaiter(this, void 0, void 0, function* () {
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