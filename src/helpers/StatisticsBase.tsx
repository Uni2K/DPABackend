/**
 * Increases the reputation of a user
 * -> Voting works without having an account -> UserID might be 0
 * -> Call on AnswerQuestions + createQuestion
 */
import {PollTypeFlagInterface} from "../interfaces/PollTypeFlagInterface";
import {
    PollTypeFlags,
    PollTypes,
    TRIBUT_CREATE_DEEP,
    TRIBUT_CREATE_DEFAULT,
    TRIBUT_CREATE_LOCAL, TRIBUT_CREATE_PRIVATESTRICT, TRIBUT_CREATE_PRIVATESUB, TRIBUT_CREATE_THREAD,
    TRIBUT_CREATE_TOF
} from "./Constants";

export async function adjustReputation(user, value) {
    if (user) {
        user.reputation = user.reputation + value;
        await user.save();
    }
}

export function calculatePollTribute(req): number {
    let type: number = req.body.polltype;
    let typeFlags: Array<PollTypeFlagInterface> = JSON.parse(req.body.polltypeflags);

    let rep: number = 0;

    switch (type) {
        case PollTypes.Default:
            rep = rep + TRIBUT_CREATE_DEFAULT;
            break;
        case PollTypes.Deep:
            rep = rep + TRIBUT_CREATE_DEEP;
            break;
        case PollTypes.ToF:
            rep = rep + TRIBUT_CREATE_TOF;
            break;
    }

    for (let flag of typeFlags) {
        switch (flag.type) {
            case PollTypeFlags.Local:
                rep = rep + TRIBUT_CREATE_LOCAL;
                break;
            case PollTypeFlags.PrivateStrict:
                rep = rep + TRIBUT_CREATE_PRIVATESTRICT;
                break;
            case PollTypeFlags.PrivateSubs:
                rep = rep + TRIBUT_CREATE_PRIVATESUB;
                break;
            case PollTypeFlags.Thread:
                rep = rep + TRIBUT_CREATE_THREAD;
                break;
        }

    }
    return rep;
}

/**
 * Takes the reputation from the correct user as an input and the threshold
 */
export function isReputationEnough(reputation, threshold): boolean {
    if (reputation > threshold) {
        return true;
    } else {
        return false;
    }
}
