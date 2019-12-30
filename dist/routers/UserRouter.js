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
const auth = require("../middleware/auth");
const statRoutines = require("../helpers/StatisticsBase");
module.exports = function (pollModel, userModel, topicModel, express) {
    const router = express.Router();
    router.post("/users/signup", (req, res) => __awaiter(this, void 0, void 0, function* () {
        // Create a new user
        try {
            const user = new userModel(req.body);
            try {
                yield user.save();
            }
            catch (err) {
                console.log("ERR: " + err.message.toString());
                if (err.message.toString().includes("email")) {
                    throw Error("304");
                }
                else if (err.message.toString().includes("name")) {
                    throw Error("305");
                }
                else
                    throw Error("400");
            }
            const token = yield user.generateAuthToken();
            user.password = ""; //Dont send this infos to the client
            user.tokens = "";
            res.status(201).send({ user, token });
        }
        catch (error) {
            console.log(error.message);
            switch (error.message) {
                case "305":
                    //UserName already exists
                    res.status(305).send(error.message);
                    break;
                case "304":
                    //Email already exists
                    res.status(304).send(error.message);
                    break;
                default:
                    res.status(400).send("400");
                    break;
            }
        }
    }));
    router.post("/users/feed", (req, res) => __awaiter(this, void 0, void 0, function* () {
        try {
            const loadSize = req.body.loadSize;
            const key = req.body.key;
            const older = req.body.older;
            const userid = req.body.id;
            const feedLoader = new FeedLoader(pollModel, userModel, topicModel);
            yield feedLoader.getFeed(res, userid, loadSize, key, older);
        }
        catch (error) {
            console.log(error);
            res.status(500).send(error);
        }
    }));
    router.post("/users/me", auth, (req, res) => __awaiter(this, void 0, void 0, function* () {
        // View logged in user profile
        try {
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
    /**
     * Vote not logged in
     * Only works with finyandupdate, not manual saving and editing. reason unknown
     * return Question to Update the adapter once
     */
    router.post("/questions/voteopen", (req, res) => __awaiter(this, void 0, void 0, function* () {
        try {
            const questionID = req.body.questionid;
            const indexofanswer = req.body.indexofanswer;
            const number = "votes.".concat(indexofanswer);
            const qst = yield pollModel.findByIdAndUpdate(questionID, { $inc: { [number]: 1 }, updated: Date.now() }, { new: true }).populate("userid", "name avatar").populate("tags", topicModel);
            res.status(200).send(qst);
        }
        catch (err) {
            res.status(400).send(err.message);
        }
    }));
    router.post("/questions/voteclosed", auth, (req, res) => __awaiter(this, void 0, void 0, function* () {
        try {
            const questionID = req.body.questionid;
            const indexofanswer = req.body.indexofanswer;
            const qst = yield pollModel.findById(questionID).exec();
            if (qst) {
                if (qst.answers.size > indexofanswer) {
                    qst.answers[indexofanswer] = qst.answers[indexofanswer] + 1;
                    yield qst.save();
                    statRoutines.increaseReputation(req.user, statRoutines.REPUTATION_INCREASE_VOTE);
                    yield req.user.save();
                    res.status(200).send("");
                }
                else {
                    res.status(307).send("");
                }
            }
            else {
                res.status(306).send("");
            }
        }
        catch (err) {
            res.status(400).send("");
        }
    }));
    router.post("/users/me/edit", auth, (req, res) => __awaiter(this, void 0, void 0, function* () {
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
        let token;
        try {
            const user = yield userModel.findByIdAndUpdate(req.user._id, {
                "$addToSet": { "subscriptions": { content: req.body.id, type: req.body.type } }
            }, { new: true }).select("-password -tokens -email");
            let token = req.token;
            res.send({ user, token });
        }
        catch (error) {
            //ALREADY EXISITS -> ALREADY SUBSCRIBED
            if (error.message.includes("duplicate")) {
                req.user.password = ""; //Dont send this infos to the client
                req.user.tokens = "";
                const user = req.user;
                token = req.token;
                res.send({ user, token });
            }
            else {
                res.status(500).send(error);
            }
        }
    }));
    router.post("/users/me/unsubscribe", auth, (req, res) => __awaiter(this, void 0, void 0, function* () {
        try {
            const user = yield userModel.findByIdAndUpdate(req.user._id, {
                "$pull": { "subscriptions": { content: req.body.id, type: req.body.type } }
            }, { new: true }).select("-password -tokens -email");
            const token = req.token;
            res.send({ user, token });
        }
        catch (error) {
            res.status(500).send(error);
        }
    }));
    router.post("/users/user", (req, res) => __awaiter(this, void 0, void 0, function* () {
        try {
            const user = yield userModel.findOne({ _id: req.body.id }).exec();
            if (!user) {
                throw new Error("300");
            }
            user.password = ""; //Dont send this infos to the client
            user.tokens = "";
            console.log("getUser" + req.body.id + "   " + user);
            res.status(201).send(user);
        }
        catch (error) {
            if (error.message === "300") {
                res.status(300).send(error.message);
            }
            else {
                res.status(400).send("400");
            }
        }
    }));
    router.post("/users/following", (req, res) => __awaiter(this, void 0, void 0, function* () {
        var loadSize = req.body.loadSize;
        var key = req.body.key;
        var type = req.body.type;
        var userid = req.body.id;
        var older = req.body.older;
        const user = yield userModel.findOne({ _id: userid }).exec();
        const skippie = Math.max(0, key) * loadSize;
        const followingIDs = user.following.slice(skippie, loadSize + 1);
        const query = {};
        if (userid) {
            query["_id"] = { $in: followingIDs };
        }
        const questions = yield userModel
            .find(query)
            .select("-password -tokens -email")
            .limit(loadSize)
            .exec();
        res.status(200).send(questions);
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
        try {
            const { email, password } = req.body;
            const user = yield userModel.findByCredentials(email, password);
            if (!user) {
                return res
                    .status(401)
                    .send({ error: "Login failed! Check authentication credentials" });
            }
            const token = yield user.generateAuthToken();
            user.password = ""; //Dont send this infos to the client
            user.tokens = "";
            res.send({ user, token });
        }
        catch (error) {
            switch (error.message) {
                case "300":
                    //Invalid Email
                    res.status(300).send(error.message);
                    break;
                case "301":
                    //Invalid PAssword
                    res.status(301).send(error.message);
                    break;
                default:
                    res.status(400).send("400");
                    break;
            }
        }
    }));
    return router;
};
//# sourceMappingURL=UserRouter.js.map