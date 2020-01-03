import {Router} from "express";
import {express, pollBase, userBase} from "../app";
import {FeedLoader} from "../content/FeedLoader";
import {ERROR_USER_AUTH, ERROR_USER_UNKNOWN, REQUEST_OK} from "../helpers/Constants";

const auth = require("../middleware/auth");

export = function(): Router {
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
    router.post("/users/createPoll", auth,async (req, res) => {
        // Create a new user


        pollBase.createPoll( req).catch((error) => {
            console.log(error.message);
            res.status(error.message).send(error);
        }).then((result) => {
            res.status(REQUEST_OK).send(result);
        });

    });
    router.post("/users/feed", async (req, res) => {

        const loadSize = req.body.loadSize;
        const key = req.body.key;
        const older = req.body.older;
        const userid = req.body.id;
        const feedLoader = new FeedLoader();
        feedLoader.getFeed(res, userid, loadSize, key, older).catch((error) => {
            console.log(error);
            res.status(ERROR_USER_UNKNOWN).send(error);
        }).then((result) => {
            res.status(REQUEST_OK).send(result);

        });

    });

    router.post("/users/me", auth, async (req, res) => {
        // View logged in user profile
        try {
            req.user.password = ""; //Dont send this infos to the client
            req.user.sessionTokens = [];
            const user = req.user;
            const token = req.token;
            res.status(REQUEST_OK).send({user, token});
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

    router.post("/users/me/edit", auth, async (req, res) => {
        //TODO complete this
        req.user.desc = req.body.desc;
        req.user.location = req.body.location;
        try {
            await req.user.save();
            req.user.password = ""; //Dont send this infos to the client
            req.user.tokens = "";
            const user = req.user;
            const token = req.token;
            res.send({user, token});
        } catch (error) {
            res.status(500).send(error);
        }
    });

    router.post("/users/me/subscribe", auth, async (req, res) => {

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
