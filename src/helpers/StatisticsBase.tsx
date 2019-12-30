
const REPUTATION_THRESHOLD_CREATE = 30;
const REPUTATION_THRESHOLD_FLAG = 300;
const REPUTATION_THRESHOLD_CREATE_FOREVER = 1000;
const REPUTATION_INCREASE_CREATE = 5;
const REPUTATION_INCREASE_VOTE = 1;

/**
 * Increases the reputation of a user
 * -> Voting works without having an account -> UserID might be 0
 * -> Call on AnswerQuestions + createQuestion
 */
exports.increaseReputation =  function(user, type) {
    if (user) {
        if (type == REPUTATION_INCREASE_CREATE)
            user.reputation = user.reputation + REPUTATION_INCREASE_CREATE;
        else user.reputation = user.reputation + REPUTATION_INCREASE_VOTE;
    }};

/**
 * Takes the reputation from the correct user as an input and the threshold
 */
exports.isReputationEnough = function(reputation, threshold) {
    if (reputation > threshold) {
        return true;
    } else return false;
}
