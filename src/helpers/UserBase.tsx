import {performance} from 'perf_hooks';
import {pollModel} from "../models/Poll";
import {topicModel} from "../models/Topic";
import {userModel} from "../models/User";
import {
    ERROR_USER_DUPLICATE_SUB,
    ERROR_USER_EMAIL,
    ERROR_USER_LOGIN_FAILED,
    ERROR_USER_NAME,
    ERROR_USER_UNKNOWN
} from "./Constants";
import {increaseReputation, REPUTATION_INCREASE_VOTE} from "./StatisticsBase";

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
            await increaseReputation(user, REPUTATION_INCREASE_VOTE);
        }
        return result;
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



    async userByID(req){
        return userModel.findOne({ _id: req.body.id }).select("-email -password -sessionTokens").lean().exec();
    }

}
