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
class UserBase {
    constructor(pollModel, userModel, topicModel) {
        this.userModel = userModel;
        this.pollModel = pollModel;
        this.topicModel = topicModel;
        // this.createSampleUsers()
    }
    createSampleUsers() {
        return __awaiter(this, void 0, void 0, function* () {
            const number = 50;
            console.log("User Creation started!");
            const startTime = perf_hooks_1.performance.now();
            yield this.userModel.remove({ "name": { "$regex": "User" } }).exec();
            for (let i = 0; i < number; i++) {
                const user = new this.userModel({
                    name: "User" + i,
                    password: "asdasdasd",
                    email: "testEmail" + i + "@gmail.com"
                });
                yield user.save();
                console.log((i + 1) + "/" + number + " User Created: " + user._id + "  TIME: " + (perf_hooks_1.performance.now() - startTime));
            }
        });
    }
}
exports.UserBase = UserBase;
//# sourceMappingURL=UserBase.js.map