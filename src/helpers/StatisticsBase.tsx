/**
 * Increases the reputation of a user
 * -> Voting works without having an account -> UserID might be 0
 * -> Call on AnswerQuestions + createQuestion
 */
import {REPUTATION_INCREASE_CREATE, REPUTATION_INCREASE_VOTE} from "./Constants";

export async function increaseReputation(user, type) {
    if (user) {
        if (type == REPUTATION_INCREASE_CREATE)
            user.reputation = user.reputation + REPUTATION_INCREASE_CREATE;
        else user.reputation = user.reputation + REPUTATION_INCREASE_VOTE;

        await user.save()
    }};

/**
 * Takes the reputation from the correct user as an input and the threshold
 */
export function isReputationEnough(reputation, threshold):boolean {
    if (reputation > threshold) {
        return true;
    } else return false;
}
