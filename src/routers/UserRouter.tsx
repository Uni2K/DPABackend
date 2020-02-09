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

/**
 * USER Express Router
 */
export = function (): Router {
    const router = express.Router();
    router.post("/users/signup", async (req, res) => {
        // Create a new user
        userBase.createUser(res, req).catch((error) => {
            console.log(error.message);
            res.status(error.message).send(error);
        }).then((result) => {
            res.status(REQUEST_OK).send(result);
        });

    });
    router.post("/users/createPoll", auth, async (req, res) => {
        // Create a new Poll
        await pollBase.createPoll(req, res);

    });
    router.get("/users/feed", auth, async (req, res) => {

        const data = await feedLoader.getFeed(req.user, parseInt(req.query.index), parseInt(req.query.pageSize), req.query.direction);

        if (data.length > 0) {
            res.status(200).json(data)
        }
        else {
            res.status(204).json();
        }

    });


    router.post("/data/snapshot", async (req, res) => {
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
            req.user.password = ""; //Dont send this infos to the client
            req.user.sessionTokens = [];
            const user = req.user;
            const token = req.token;
            res.status(REQUEST_OK).send({ user, token });
        } catch (error) {
            res.status(ERROR_USER_AUTH).send(error);
        }
    });

    router.post("/data/vote", async (req, res) => {
        userBase.vote(req).catch((err) => {
            res.status(err.message).send(err.message);
        }
        ).then((result) => {
            res.status(REQUEST_OK).send(result);
        });
    });

    router.post("/users/block", auth, async (req, res) => {
        userBase.block(req).catch((err) => {
            res.status(err.message).send(err.message);
        }
        ).then((result) => {
            res.status(REQUEST_OK).send(result);
        });
    });
    router.post("/users/unblock", auth, async (req, res) => {
        userBase.unblock(req).catch((err) => {
            res.status(err.message).send(err.message);
        }
        ).then((result) => {
            res.status(REQUEST_OK).send(result);
        });
    });
    router.post("/users/getBlockedUser", auth, async (req, res) => {
        userBase.getBlockedUser(req).catch((err) => {
            res.status(err.message).send(err.message);
        }
        ).then((result) => {
            res.status(REQUEST_OK).send(result);
        });
    });

    router.post('/users/getAvatar', async function (req, res) {
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
        // let userid=req.user._id
        let userid = "5dc6e18122304238205eccba" //Example, for debuggin
        req.user = {}

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


            await imageModel.deleteMany({ user: userid, purpose: ImagePurposes.Avatar }).exec();
            const img = await new imageModel({
                user: userid,
                fileName: req.file.filename,
                purpose: ImagePurposes.Avatar
            }).save();
            req.user.avatarImage = img._id;
            // await req.user.save();
            req.user.password = "";
            req.user.sessionTokens = "";
            res.status(REQUEST_OK).send(req.user);

        });

    });

    router.post("/data/report", auth, async (req, res) => {
        userBase.report(req).catch((err) => {
            res.status(err.message).send(err.message);
        }
        ).then((result) => {
            res.status(REQUEST_OK).send(result);
            adjustReputation(req.user, REPUTATION_REPORT);
        });
    });

    router.post("/data/comment", auth, async (req, res) => {
        userBase.addComment(req).catch((err) => {
            res.status(err.message).send(err.message);
        }
        ).then((result) => {
            res.status(REQUEST_OK).send(result);
            adjustReputation(req.user, REPUTATION_COMMENT);
        });
    });
    router.post("/users/me/edit", auth, async (req, res) => {

        req.user.avatarURL = req.body.avatarURL;
        req.user.headerURL = req.body.headerURL;
        req.user.additionalURL = req.body.additionalURL;

        req.user.description = req.body.description;
        req.user.location = req.body.location;
        try {
            await req.user.save();
            req.user.password = ""; //Dont send this infos to the client
            req.user.tokens = "";
            const user = req.user;
            const token = req.token;
            res.send({ user, token });
        } catch (error) {
            res.status(500).send(error);
        }
    });

    router.post("/users/me/", auth, async (req, res) => {

        userBase.subscribe(req).catch((err) => {
            res.status(err.message).send(err.message);
        }
        ).then((result) => {
            res.status(REQUEST_OK).send(result);
        });

    });

    router.post("/users/me/unsubscribe", auth, async (req, res) => {

        userBase.unsubscribe(req).catch((err) => {
            res.status(err.message).send(err.message);
        }
        ).then((result) => {
            res.status(REQUEST_OK).send(result);
        });
    });
    router.post("/users/byID", async (req, res) => {

        userBase.userByID(req).catch((error) => {
            console.log(error.message);
            res.status(error.message).send(error);
        }).then((result) => {
            res.status(REQUEST_OK).send(result);
        });

    });

    router.post("/users/me/logout", auth, async (req, res) => {
        try {
            req.user.tokens = req.user.tokens.filter(token => {
                return token.token != req.token;
            });
            await req.user.save();
            res.send();
        } catch (error) {
            res.status(500).send(error);
        }
    });

    router.post("/users/me/logoutall", auth, async (req, res) => {
        try {
            req.user.tokens.splice(0, req.user.tokens.length);
            await req.user.save();
            res.send();
        } catch (error) {
            res.status(500).send(error);
        }
    });

    router.post("/users/login", async (req, res) => {
        userBase.login(req).catch((error) => {
            console.log(error.message);
            res.status(error.message).send(error);
        }).then((result) => {
            res.status(REQUEST_OK).send(result);
        });
    });
    return router;

};


