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
/**
 * Increases the reputation of a user
 * -> Voting works without having an account -> UserID might be 0
 * -> Call on AnswerQuestions + createQuestion
 */
const Constants_1 = require("./Constants");
function increaseReputation(user, type) {
    return __awaiter(this, void 0, void 0, function* () {
        if (user) {
            if (type == Constants_1.REPUTATION_INCREASE_CREATE)
                user.reputation = user.reputation + Constants_1.REPUTATION_INCREASE_CREATE;
            else
                user.reputation = user.reputation + Constants_1.REPUTATION_INCREASE_VOTE;
            yield user.save();
        }
    });
}
exports.increaseReputation = increaseReputation;
;
/**
 * Takes the reputation from the correct user as an input and the threshold
 */
function isReputationEnough(reputation, threshold) {
    if (reputation > threshold) {
        return true;
    }
    else
        return false;
}
exports.isReputationEnough = isReputationEnough;
//# sourceMappingURL=StatisticsBase.js.map