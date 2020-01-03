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
const FeedLoader_1 = require("../content/FeedLoader");
const Constants_1 = require("../helpers/Constants");
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
        app_1.pollBase.createPoll(req).catch((error) => {
            console.log(error.message);
            res.status(error.message).send(error);
        }).then((result) => {
            res.status(Constants_1.REQUEST_OK).send(result);
        });
    }));
    router.post("/users/feed", (req, res) => __awaiter(this, void 0, void 0, function* () {
        const loadSize = req.body.loadSize;
        const key = req.body.key;
        const older = req.body.older;
        const userid = req.body.id;
        const feedLoader = new FeedLoader_1.FeedLoader();
        feedLoader.getFeed(res, userid, loadSize, key, older).catch((error) => {
            console.log(error);
            res.status(Constants_1.ERROR_USER_UNKNOWN).send(error);
        }).then((result) => {
            res.status(Constants_1.REQUEST_OK).send(result);
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
    router.post("/users/me/edit", auth, (req, res) => __awaiter(this, void 0, void 0, function* () {
        //TODO complete this
        req.user.desc = req.body.desc;
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
    router.post("/users/me/subscribe", auth, (req, res) => __awaiter(this, void 0, void 0, function* () {
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