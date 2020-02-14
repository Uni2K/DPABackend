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
Object.defineProperty(exports, "__esModule", { value: true });
const perf_hooks_1 = require("perf_hooks");
const Poll_1 = require("../models/Poll");
const User_1 = require("../models/User");
const Report_1 = require("../models/Report");
const Comment_1 = require("../models/Comment");
const Conversation_1 = require("../models/Conversation");
const UserBlocked_1 = require("../models/UserBlocked");
const UserSnapshot_1 = require("../models/UserSnapshot");
const Constants_1 = require("./Constants");
const StatisticsBase_1 = require("./StatisticsBase");
class UserBase {
    //Only for debugging
    createSampleUsers() {
        return __awaiter(this, void 0, void 0, function* () {
            const number = 50;
            console.log("User Creation started!");
            const startTime = perf_hooks_1.performance.now();
            yield User_1.userModel.remove({ "name": { "$regex": "User" } }).exec();
            for (let i = 0; i < number; i++) {
                const user = new User_1.userModel({
                    name: "User" + i,
                    password: "asdasdasd",
                    email: "testEmail" + i + "@gmail.com"
                });
                yield user.save();
                console.log((i + 1) + "/" + number + " User Created: " + user._id + "  TIME: " + (perf_hooks_1.performance.now() - startTime));
            }
        });
    }
    //Creates the user
    createUser(res, req) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = new User_1.userModel(req.body);
            try {
                yield user.save();
            }
            catch (err) {
                if (err.message.toString().includes("email")) { //This kind of message threw by the validation tool
                    throw Error(Constants_1.ERROR_USER_EMAIL);
                }
                else if (err.message.toString().includes("name")) {
                    throw Error(Constants_1.ERROR_USER_NAME);
                }
                else {
                    throw Error(Constants_1.ERROR_USER_UNKNOWN);
                }
            }
            // @ts-ignore  //TODO Why is this recognized as wrong but still works?! -> https://stackoverflow.com/questions/42448372/typescript-mongoose-static-model-method-property-does-not-exist-on-type
            const token = yield user.generateAuthToken();
            user.password = ""; //Dont send this infos to the client
            user.sessionTokens = [];
            return { user, token };
        });
    }
    login(req) {
        return __awaiter(this, void 0, void 0, function* () {
            const { email, password } = req.body;
            const user = yield User_1.userModel.findByCredentials(email, password);
            if (!user) {
                throw Error(Constants_1.ERROR_USER_LOGIN_FAILED);
            }
            let token;
            try {
                token = yield user.generateAuthToken();
            }
            catch (err) {
                if (err.message.toString().includes("email")) {
                    throw Error(Constants_1.ERROR_USER_EMAIL);
                }
                else if (err.message.toString().includes("name")) {
                    throw Error(Constants_1.ERROR_USER_NAME);
                }
                else {
                    throw Error(Constants_1.ERROR_USER_UNKNOWN);
                }
            }
            user.password = ""; //Dont send this infos to the client
            user.tokens = "";
            return { token, user };
        });
    }
    /**
     * Vote on a poll
     */
    vote(req) {
        return __awaiter(this, void 0, void 0, function* () {
            const questionID = req.body.pollid;
            const indexofanswer = req.body.indexofanswer;
            const user = req.user;
            const selection = "answers.".concat(indexofanswer).concat("votes");
            const result = yield Poll_1.pollModel.findByIdAndUpdate(questionID, { $inc: { selection: 1 } }, { new: true }).populate("userid", "name avatar").exec();
            if (user !== undefined) {
                yield StatisticsBase_1.adjustReputation(user, Constants_1.REPUTATION_VOTE);
            }
            return result;
        });
    }
    /**
     * Report a User
     */
    report(req) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Report_1.reportModel({
                user: req.user._id,
                type: req.body.type,
                target: req.body.target
            }).save();
        });
    }
    /**
     * OUTDATED
     */
    subscribe(req) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = yield User_1.userModel.findByIdAndUpdate(req.user._id, {
                    $addToSet: { "subscriptions": { content: req.body.id, type: req.body.type } }
                }, { new: true }).select("-password -sessionTokens -email");
                let token = req.token;
                return { user, token };
            }
            catch (error) {
                if (error.message.includes("duplicate")) {
                    throw Error(Constants_1.ERROR_USER_DUPLICATE_SUB);
                }
                else {
                    throw Error(Constants_1.ERROR_USER_UNKNOWN);
                }
            }
        });
    }
    /**
     * OUTDATED
     */
    unsubscribe(req) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = yield User_1.userModel.findByIdAndUpdate(req.user._id, {
                    "$pull": { "subscriptions": { content: req.body.id, type: req.body.type } }
                }, { new: true }).select("-password -sessionTokens -email");
                let token = req.token;
                return { user, token };
            }
            catch (error) {
                if (error.message.includes("duplicate")) {
                    throw Error(Constants_1.ERROR_USER_DUPLICATE_SUB);
                }
                else {
                    throw Error(Constants_1.ERROR_USER_UNKNOWN);
                }
            }
        });
    }
    userByID(req) {
        return __awaiter(this, void 0, void 0, function* () {
            return User_1.userModel.findOne({ _id: req.body.id }).select("-email -password -sessionTokens").lean().exec();
        });
    }
    /**
     * A Comment in a deep pool conversation
     *  POLL
     *  --> Conversation 1
     *     -->Comment
     *     -->Comment
     *     -->Comment
     --> Conversation 2
     *     -->Comment
     *     -->Comment
     *     -->Comment
     */
    addComment(req) {
        return __awaiter(this, void 0, void 0, function* () {
            let conversation = null;
            if (req.conversationid != "-1") {
                conversation = yield Conversation_1.conversationModel.findOne({ _id: req.body.conversationid }).lean().exec();
                if (conversation == null) {
                    //TODO: TEST it
                    conversation = yield this.createConversation(req);
                }
            }
            else {
                conversation = yield this.createConversation(req);
            }
            const user = new Comment_1.commentModel({
                user: req.user._id,
                conversation: conversation._id,
                header: req.body.header,
                content: req.body.content,
                parentComment: req.body.parentcomment
            });
            return user.save();
        });
    }
    getSnapshots(req) {
        return __awaiter(this, void 0, void 0, function* () {
            return UserSnapshot_1.userSnapshotModel.find({ enabled: true, user: req.body.user }).lean().exec();
        });
    }
    getComments(req) {
        return __awaiter(this, void 0, void 0, function* () {
            return Comment_1.commentModel.findOne({ conversation: req.body.conversationid }).lean().exec();
        });
    }
    getConversations(req) {
        return __awaiter(this, void 0, void 0, function* () {
            return Conversation_1.conversationModel.findOne({ parentPoll: req.body.pollid }).lean().exec();
        });
    }
    createConversation(req) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = new Conversation_1.conversationModel({
                user: req.user._id,
            });
            return user.save();
        });
    }
    block(req) {
        return __awaiter(this, void 0, void 0, function* () {
            return new UserBlocked_1.userBlockedModel({
                user: req.user._id,
                blockeduser: req.body.blockeduser
            }).save();
        });
    }
    unblock(req) {
        return __awaiter(this, void 0, void 0, function* () {
            return UserBlocked_1.userBlockedModel.deleteMany({ user: req.user._id, blockeduser: req.body.blockeduser }).exec();
        });
    }
    getBlockedUser(req) {
        return __awaiter(this, void 0, void 0, function* () {
            return UserBlocked_1.userBlockedModel.find({ user: req.user._id }).exec();
        });
    }
}
exports.UserBase = UserBase;
//# sourceMappingURL=UserBase.js.map