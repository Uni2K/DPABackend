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
class PollBase {
    constructor(pollModel, userModel, topicModel) {
        this.userModel = userModel;
        this.pollModel = pollModel;
        this.topicModel = topicModel;
        // this.createSamplePolls()
    }
    createPoll() {
        return __awaiter(this, void 0, void 0, function* () {
            //TODO Implement
        });
    }
    createSamplePolls() {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("Poll Creation started!");
            const startTime = perf_hooks_1.performance.now();
            yield this.userModel.remove({}).exec();
            const user = yield this.userModel.findOne().exec();
            for (let i = 0; i < 1000; i++) {
                const poll = new this.pollModel({
                    expirationDate: Date.now(),
                    user: [user._id],
                    header: "Example", description: "Just a random stupid question!",
                    type: 0, answers: [{
                            text: "Answer 1", type: 0,
                            votes: 100
                        }],
                    scoreOverall: Date.now()
                }).save();
                // console.log((i + 1) + "/" +number + " Poll Created: " + poll._id + "  TIME: " + (performance.now() - startTime));
            }
        });
    }
}
exports.PollBase = PollBase;
//# sourceMappingURL=PollBase.js.map