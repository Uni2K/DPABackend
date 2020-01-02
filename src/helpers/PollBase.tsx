import {performance} from 'perf_hooks';

export class PollBase {
    private userModel;
    private pollModel;
    private topicModel;

    constructor(pollModel, userModel, topicModel) {
        this.userModel = userModel;
        this.pollModel = pollModel;
        this.topicModel = topicModel;
        // this.createSamplePolls()
    }

    async createPoll(){
        //TODO Implement
    }


    async createSamplePolls() {
        console.log("Poll Creation started!");
        const startTime = performance.now();
        await this.userModel.remove({}).exec();
        const user=await this.userModel.findOne().exec()

        for (let i = 0; i < 1000; i++) {
           const poll= new this.pollModel({
                expirationDate: Date.now(),
                user:[user._id],
                header: "Example", description: "Just a random stupid question!"
                , type: 0, answers: [{
                    text: "Answer 1", type: 0,
                    votes: 100
                }],
                scoreOverall: Date.now()
            }).save();
           // console.log((i + 1) + "/" +number + " Poll Created: " + poll._id + "  TIME: " + (performance.now() - startTime));


        }

    }

}
