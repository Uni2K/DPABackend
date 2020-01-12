import {performance} from 'perf_hooks';
import {pollModel} from "../models/Poll";
import {pollSnapshotModel} from "../models/PollSnapshot";
import {topicModel} from "../models/Topic";
import {userModel} from "../models/User";
import {reportModel} from "../models/Report";
import {commentModel} from "../models/Comment";
import {conversationModel} from "../models/Conversation";
import {userBlockedModel} from "../models/UserBlocked";
import {userSnapshotModel} from "../models/UserSnapshot";

import {
    ERROR_USER_DUPLICATE_SUB,
    ERROR_USER_EMAIL,
    ERROR_USER_LOGIN_FAILED,
    ERROR_USER_NAME,
    ERROR_USER_UNKNOWN, REPUTATION_VOTE
} from "./Constants";
import {adjustReputation} from "./StatisticsBase";

export class UserBase {

    async createSampleUsers() {
        const number = 50;
        console.log("User Creation started!");
        const startTime = performance.now();
        await userModel.remove({"name": {"$regex": "User"}}).exec();

        for (let i = 0; i < number; i++) {
            const user = new userModel({
                name: "User" + i,
                password: "asdasdasd",
                email: "testEmail" + i + "@gmail.com"
            });

            await user.save();
            console.log((i + 1) + "/" + number + " User Created: " + user._id + "  TIME: " + (performance.now() - startTime));
        }

    }

    async createUser(res, req: Request) {

        const user = new userModel(req.body);
        try {
            await user.save();
        } catch (err) {
            if (err.message.toString().includes("email")) {
                throw Error(ERROR_USER_EMAIL);
            } else if (err.message.toString().includes("name")) {
                throw Error(ERROR_USER_NAME);
            } else {
                throw Error(ERROR_USER_UNKNOWN);
            }
        }

        // @ts-ignore  //TODO Why is this recognized as wrong but still works?! -> https://stackoverflow.com/questions/42448372/typescript-mongoose-static-model-method-property-does-not-exist-on-type
        const token = await user.generateAuthToken();

        user.password = ""; //Dont send this infos to the client
        user.sessionTokens = [];
        return {user, token};

    }

    async login(req) {

        const {email, password} = req.body;
        const user = await userModel.findByCredentials(email, password);

        if (!user) {
            throw Error(ERROR_USER_LOGIN_FAILED);
        }
        let token;
        try {
            token = await user.generateAuthToken();
        } catch (err) {
            if (err.message.toString().includes("email")) {
                throw Error(ERROR_USER_EMAIL);
            } else if (err.message.toString().includes("name")) {
                throw Error(ERROR_USER_NAME);
            } else {
                throw Error(ERROR_USER_UNKNOWN);
            }
        }

        user.password = ""; //Dont send this infos to the client
        user.tokens = "";
        return {token, user};

    }

    async vote(req) {
        const questionID = req.body.pollid;
        const indexofanswer = req.body.indexofanswer;
        const user = req.user;
        const selection = "answers.".concat(indexofanswer).concat("votes");
        const result = await pollModel.findByIdAndUpdate(
            questionID,
            {$inc: {selection: 1}},
            {new: true}
        ).populate("userid", "name avatar").exec();

        if (user !== undefined) {
            await adjustReputation(user, REPUTATION_VOTE);
        }
        return result;
    }

    async report(req) {
        return new reportModel({
            user: req.user._id,
            type: req.body.type,
            target: req.body.target
        }).save();

    }

    async subscribe(req) {
        try {
            const user = await userModel.findByIdAndUpdate(req.user._id, {
                    "$addToSet": {"subscriptions": {content: req.body.id, type: req.body.type}}
                },
                {new: true}).select("-password -sessionTokens -email");
            let token = req.token;
            return {user, token};

        } catch (error) {
            if (error.message.includes("duplicate")) {
                throw Error(ERROR_USER_DUPLICATE_SUB);
            } else {
                throw Error(ERROR_USER_UNKNOWN);
            }

        }

    }

    async unsubscribe(req) {
        try {
            const user = await userModel.findByIdAndUpdate(req.user._id, {
                    "$pull": {"subscriptions": {content: req.body.id, type: req.body.type}}
                },
                {new: true}).select("-password -sessionTokens -email");
            let token = req.token;
            return {user, token};

        } catch (error) {
            if (error.message.includes("duplicate")) {
                throw Error(ERROR_USER_DUPLICATE_SUB);
            } else {
                throw Error(ERROR_USER_UNKNOWN);
            }

        }

    }

    async userByID(req) {
        return userModel.findOne({_id: req.body.id}).select("-email -password -sessionTokens").lean().exec();
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
    async addComment(req) {

        let conversation = null;
        if (req.conversationid != "-1") {
            conversation = await conversationModel.findOne({_id: req.body.conversationid}).lean().exec();

            if (conversation == null) {
                //TODO: TEST it
                conversation = await this.createConversation(req);
            }

        } else {
            conversation = await this.createConversation(req);
        }


        const user = new commentModel({
            user: req.user._id,
            conversation:conversation._id,
            header: req.body.header,
            content: req.body.content,
            parentComment:req.body.parentcomment

        });

        return user.save();

    }

    async getSnapshots(req){
        return userSnapshotModel.find({enabled:true, user:req.body.user}).lean().exec()
    }
    async getComments(req){
       return commentModel.findOne({conversation: req.body.conversationid}).lean().exec();
    }
    async getConversations(req){
        return conversationModel.findOne({parentPoll: req.body.pollid}).lean().exec();
    }


    private async createConversation(req) {

        const user = new conversationModel({
            user: req.user._id,

        });

        return user.save();

    }

    async block(req) {
        return new userBlockedModel({
            user:req.user._id,
            blockeduser: req.body.blockeduser
        }).save()
    }
    async unblock(req) {
        return userBlockedModel.deleteMany({user:req.user._id, blockeduser: req.body.blockeduser}).exec()
    }
    async getBlockedUser(req) {
        return userBlockedModel.find({user:req.user._id}).exec()
    }
}
