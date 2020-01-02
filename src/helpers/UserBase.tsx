import {performance} from 'perf_hooks';

export class UserBase {
    private userModel;
    private pollModel;
    private topicModel;

    constructor(pollModel, userModel, topicModel) {
        this.userModel = userModel;
        this.pollModel = pollModel;
        this.topicModel = topicModel;
        // this.createSampleUsers()
    }

    async createSampleUsers() {
        const number=50
        console.log("User Creation started!");
        const startTime = performance.now();
        await this.userModel.remove({"name":{"$regex": "User"}}).exec();

        for (let i = 0; i < number; i++) {
            const user = new this.userModel({
                name: "User"+i,
                password: "asdasdasd",
                email: "testEmail"+i+"@gmail.com"
            });

            await user.save();
            console.log((i + 1) + "/" +number + " User Created: " + user._id + "  TIME: " + (performance.now() - startTime));
        }

    }

}
