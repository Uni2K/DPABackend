//Size of the contentlists
export const CONTENTLIST_SIZE: number = 1000;

//See Periodic Runners, the intervals for the jobs that get called periodically
export const INTERVAL_CONTENTLIST_REFRESH: number = 15000;
export const INTERVAL_SNAPSHOT_CREATION: number = 25000;
export const INTERVAL_PRIORITY_UPDATE: number = 15000;

//Response Codes
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

//Tributes -> How much reputation on of the action will cost the user
export const TRIBUT_CREATE_DEFAULT = 5;
export const TRIBUT_CREATE_DEFAULT_IMAGE = 10;
export const TRIBUT_CREATE_DEEP = 100;
export const TRIBUT_CREATE_TOF = 20;
export const TRIBUT_CREATE_LOCAL = 2;
export const TRIBUT_CREATE_PRIVATESUB = 5;
export const TRIBUT_CREATE_PRIVATESTRICT = 5;
export const TRIBUT_CREATE_THREAD = 15;
export const TRIBUT_CREATE_DURATION_IMAGE = 10;

//Reputation -> a experience points like value that increases with voting, report, comment and can also decrease  (tributes, duplicate)
export const REPUTATION_VOTE = 10;
export const REPUTATION_REPORT = 10;
export const REPUTATION_COMMENT = 20;
export const REPUTATION_GETFLAGGED = -10;
export const REPUTATION_DUPLICATE = -10;

//Path for the avatar uploads in the user profil
export const avatarPath= process.cwd()+"/uploads/avatars/"

//amount of trendingTopics
export const TRENDING_TOPICS_AMOUNT = 10;
//Snapshot amount
export const SNAPSHOTS_TOPICS = 4;

//ContentPool weight
export const PRIORITY_SINGLE_SUBED_CONTENT = 0;
export const PRIORITY_MULTIPLE_SUBED_CONTENT = 50;
export const NUMBER_OF_SNAPSHOTS = 5;


//Purpose of uploaded Images, they get stored in a separate collection with one of these identifiers
export enum ImagePurposes {
   Answer,
    Poll,
    Avatar,
    Header
}


//Poll-Answertypes used in differenct poll types. ToF -> Top of flop
export enum AnswerTypes {
    Text,
    Image,
    Location,
    ToFPositive,
    ToFNegative
}

//Options for Polls, marked with flags, one question can have multiple options/typeflags
export enum PollTypeFlags {
    Idle,
    Local, //Location Added
    PrivateSubs, // only for subs
    PrivateStrict, //only for link users
    Thread,
    Limited
}

//users, polls can be reported to the system by users. These are some reasons
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

//Types of polls, a type differes from an option/typeflag because it changes some fundamental things, e.g. allowing commets, getting displayed separate
export enum PollTypes {
    Default, //Simple Polls, 1 Question , fixed number of Answers
    Deep,  //Advanced Polls, 1 Queston, fixed number of Answers, Comment possibility, no time limit
    ToF //Top of Flop, only 2 possible answers, very dynamic and displayed different
}


//Poll can stay a specific time till they expire and do not allow any more answering. "u"= umlimited (higher tribute when creating)
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

//Used to mark topics that are in special categories
export enum TopicFlags {
    Idle,
    Recommended,
    Hot,
    New
}

//contentlist, relatively outdated for now
export enum ContentLists {
    Hot,
    Recent,
    Recommended,
    ScoreToplist

}

/**
 * Used to mark content, especially polls as trending, recommended etc.
 *Example: A poll is trending, cause the score gets high, where ever this poll is now displayed (different points in the app)
 the poll should be marked as trending. This could be done by just asking the server if this specific poll is inside the trending list,
 or alternatively, the poll gets flagged as trending, as long as it is in the trending list.
 **/
export enum ContentFlags {
    Idle,
    Recommended,
    Hot,
    Controverse

}
