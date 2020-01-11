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
const Constants_1 = require("./Constants");
function adjustReputation(user, value) {
    return __awaiter(this, void 0, void 0, function* () {
        if (user) {
            user.reputation = user.reputation + value;
            yield user.save();
        }
    });
}
exports.adjustReputation = adjustReputation;
function calculatePollTribute(req) {
    let type = req.body.polltype;
    let typeFlags = JSON.parse(req.body.polltypeflags);
    let rep = 0;
    switch (type) {
        case Constants_1.PollTypes.Default:
            rep = rep + Constants_1.TRIBUT_CREATE_DEFAULT;
            break;
        case Constants_1.PollTypes.Deep:
            rep = rep + Constants_1.TRIBUT_CREATE_DEEP;
            break;
        case Constants_1.PollTypes.ToF:
            rep = rep + Constants_1.TRIBUT_CREATE_TOF;
            break;
    }
    for (let flag of typeFlags) {
        switch (flag.type) {
            case Constants_1.PollTypeFlags.Local:
                rep = rep + Constants_1.TRIBUT_CREATE_LOCAL;
                break;
            case Constants_1.PollTypeFlags.PrivateStrict:
                rep = rep + Constants_1.TRIBUT_CREATE_PRIVATESTRICT;
                break;
            case Constants_1.PollTypeFlags.PrivateSubs:
                rep = rep + Constants_1.TRIBUT_CREATE_PRIVATESUB;
                break;
            case Constants_1.PollTypeFlags.Thread:
                rep = rep + Constants_1.TRIBUT_CREATE_THREAD;
                break;
        }
    }
    return rep;
}
exports.calculatePollTribute = calculatePollTribute;
/**
 * Takes the reputation from the correct user as an input and the threshold
 */
function isReputationEnough(reputation, threshold) {
    if (reputation > threshold) {
        return true;
    }
    else {
        return false;
    }
}
exports.isReputationEnough = isReputationEnough;
//# sourceMappingURL=StatisticsBase.js.map