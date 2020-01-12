export const CONTENTLIST_SIZE: number = 1000;

export const INTERVAL_CONTENTLIST_REFRESH: number = 15000;
export const INTERVAL_SNAPSHOT_CREATION: number = 100000;

export const REQUEST_OK = 200;

export const ERROR_USER_UNKNOWN = "400";
export const ERROR_USER_NAME = "305";
export const ERROR_USER_EMAIL = "306";
export const ERROR_USER_PW = "307";

export const ERROR_USER_DUPLICATE_SUB = "308";
export const ERROR_USER_LOGIN_FAILED = "309";
export const ERROR_USER_AUTH = "310";
export const ERROR_USER_REPUTATION_NOT_ENOUGH = "311";

export const ERROR_IMAGE_UPLOAD_SIZE = "358";
export const ERROR_IMAGE_UPLOAD_PARTS = "359";
export const ERROR_IMAGE_ACCESS = "360";
export const ERROR_IMAGE_UPLOAD_UNKNOWN = "361";


export const TRIBUT_CREATE_DEFAULT = 5;
export const TRIBUT_CREATE_DEFAULT_IMAGE = 10;
export const TRIBUT_CREATE_DEEP = 100;
export const TRIBUT_CREATE_TOF = 20;

export const TRIBUT_CREATE_LOCAL = 2;
export const TRIBUT_CREATE_PRIVATESUB = 5;
export const TRIBUT_CREATE_PRIVATESTRICT = 5;
export const TRIBUT_CREATE_THREAD = 15;

export const TRIBUT_CREATE_DURATION_IMAGE = 10;

export const REPUTATION_VOTE = 10;
export const REPUTATION_REPORT = 10;
export const REPUTATION_COMMENT = 20;

export const REPUTATION_GETFLAGGED = -10;
export const REPUTATION_DUPLICATE = -10;

export const avatarPath= process.cwd()+"/uploads/avatars/"


export enum ImagePurposes {
   Answer,
    Poll,
    Avatar,
    Header
}



export enum AnswerTypes {
    Text,
    Image,
    Location,
    ToFPositive,
    ToFNegative
}

export enum PollTypeFlags {
    Idle,
    Local, //Location Added
    PrivateSubs, // only for subs
    PrivateStrict, //only for link users
    Thread,
    Limited
}

export enum ReportTypes {
    pollUnsuitable,
    pollDuplicate,
    pollSpam,
    pollHatespeech,
    userBot,
    userDuplicate,
    userHacked,
    userSpam,
    userHatespeech
}

export enum PollTypes {
    Default,
    Deep,
    ToF
}

export enum PollDurations {
    step1 = "1h",
    step2 = "3h",
    step3 = "1d",
    step4 = "3d",
    step5 = "1w",
    step6 = "3w",
    step7 = "1m",
    step8 = "3m",
    step9 = "u",

}

export enum TopicFlags {
    Idle,
    Recommended,
    Hot,
    New
}

export enum ContentLists {
    Hot,
    Recent,
    Recommended,
    ScoreToplist

}

export enum ContentFlags {
    Idle,
    Recommended,
    Hot,
    Controverse

}
