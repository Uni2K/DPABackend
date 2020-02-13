"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
//Size of the contentlists
exports.CONTENTLIST_SIZE = 1000;
//See Periodic Runners, the intervals for the jobs that get called periodically
exports.INTERVAL_CONTENTLIST_REFRESH = 15000;
exports.INTERVAL_SNAPSHOT_CREATION = 100000;
//Response Codes
exports.REQUEST_OK = 200;
exports.ERROR_USER_UNKNOWN = "400";
exports.ERROR_USER_NAME = "305";
exports.ERROR_USER_EMAIL = "306";
exports.ERROR_USER_PW = "307";
exports.ERROR_USER_DUPLICATE_SUB = "308";
exports.ERROR_USER_LOGIN_FAILED = "309";
exports.ERROR_USER_AUTH = "310";
exports.ERROR_USER_REPUTATION_NOT_ENOUGH = "311";
exports.ERROR_IMAGE_UPLOAD_SIZE = "358";
exports.ERROR_IMAGE_UPLOAD_PARTS = "359";
exports.ERROR_IMAGE_ACCESS = "360";
exports.ERROR_IMAGE_UPLOAD_UNKNOWN = "361";
//Tributes -> How much reputation on of the action will cost the user
exports.TRIBUT_CREATE_DEFAULT = 5;
exports.TRIBUT_CREATE_DEFAULT_IMAGE = 10;
exports.TRIBUT_CREATE_DEEP = 100;
exports.TRIBUT_CREATE_TOF = 20;
exports.TRIBUT_CREATE_LOCAL = 2;
exports.TRIBUT_CREATE_PRIVATESUB = 5;
exports.TRIBUT_CREATE_PRIVATESTRICT = 5;
exports.TRIBUT_CREATE_THREAD = 15;
exports.TRIBUT_CREATE_DURATION_IMAGE = 10;
//Reputation -> a experience points like value that increases with voting, report, comment and can also decrease  (tributes, duplicate)
exports.REPUTATION_VOTE = 10;
exports.REPUTATION_REPORT = 10;
exports.REPUTATION_COMMENT = 20;
exports.REPUTATION_GETFLAGGED = -10;
exports.REPUTATION_DUPLICATE = -10;
//Path for the avatar uploads in the user profil
exports.avatarPath = process.cwd() + "/uploads/avatars/";
//Purpose of uploaded Images, they get stored in a separate collection with one of these identifiers
var ImagePurposes;
(function (ImagePurposes) {
    ImagePurposes[ImagePurposes["Answer"] = 0] = "Answer";
    ImagePurposes[ImagePurposes["Poll"] = 1] = "Poll";
    ImagePurposes[ImagePurposes["Avatar"] = 2] = "Avatar";
    ImagePurposes[ImagePurposes["Header"] = 3] = "Header";
})(ImagePurposes = exports.ImagePurposes || (exports.ImagePurposes = {}));
//Poll-Answertypes used in differenct poll types. ToF -> Top of flop
var AnswerTypes;
(function (AnswerTypes) {
    AnswerTypes[AnswerTypes["Text"] = 0] = "Text";
    AnswerTypes[AnswerTypes["Image"] = 1] = "Image";
    AnswerTypes[AnswerTypes["Location"] = 2] = "Location";
    AnswerTypes[AnswerTypes["ToFPositive"] = 3] = "ToFPositive";
    AnswerTypes[AnswerTypes["ToFNegative"] = 4] = "ToFNegative";
})(AnswerTypes = exports.AnswerTypes || (exports.AnswerTypes = {}));
//Options for Polls, marked with flags, one question can have multiple options/typeflags
var PollTypeFlags;
(function (PollTypeFlags) {
    PollTypeFlags[PollTypeFlags["Idle"] = 0] = "Idle";
    PollTypeFlags[PollTypeFlags["Local"] = 1] = "Local";
    PollTypeFlags[PollTypeFlags["PrivateSubs"] = 2] = "PrivateSubs";
    PollTypeFlags[PollTypeFlags["PrivateStrict"] = 3] = "PrivateStrict";
    PollTypeFlags[PollTypeFlags["Thread"] = 4] = "Thread";
    PollTypeFlags[PollTypeFlags["Limited"] = 5] = "Limited";
})(PollTypeFlags = exports.PollTypeFlags || (exports.PollTypeFlags = {}));
//users, polls can be reported to the system by users. These are some reasons
var ReportTypes;
(function (ReportTypes) {
    ReportTypes[ReportTypes["pollUnsuitable"] = 0] = "pollUnsuitable";
    ReportTypes[ReportTypes["pollDuplicate"] = 1] = "pollDuplicate";
    ReportTypes[ReportTypes["pollSpam"] = 2] = "pollSpam";
    ReportTypes[ReportTypes["pollHatespeech"] = 3] = "pollHatespeech";
    ReportTypes[ReportTypes["userBot"] = 4] = "userBot";
    ReportTypes[ReportTypes["userDuplicate"] = 5] = "userDuplicate";
    ReportTypes[ReportTypes["userHacked"] = 6] = "userHacked";
    ReportTypes[ReportTypes["userSpam"] = 7] = "userSpam";
    ReportTypes[ReportTypes["userHatespeech"] = 8] = "userHatespeech";
})(ReportTypes = exports.ReportTypes || (exports.ReportTypes = {}));
//Types of polls, a type differes from an option/typeflag because it changes some fundamental things, e.g. allowing commets, getting displayed separate
var PollTypes;
(function (PollTypes) {
    PollTypes[PollTypes["Default"] = 0] = "Default";
    PollTypes[PollTypes["Deep"] = 1] = "Deep";
    PollTypes[PollTypes["ToF"] = 2] = "ToF"; //Top of Flop, only 2 possible answers, very dynamic and displayed different
})(PollTypes = exports.PollTypes || (exports.PollTypes = {}));
//Poll can stay a specific time till they expire and do not allow any more answering. "u"= umlimited (higher tribute when creating)
var PollDurations;
(function (PollDurations) {
    PollDurations["step1"] = "1h";
    PollDurations["step2"] = "3h";
    PollDurations["step3"] = "1d";
    PollDurations["step4"] = "3d";
    PollDurations["step5"] = "1w";
    PollDurations["step6"] = "3w";
    PollDurations["step7"] = "1m";
    PollDurations["step8"] = "3m";
    PollDurations["step9"] = "u";
})(PollDurations = exports.PollDurations || (exports.PollDurations = {}));
//Used to mark topics that are in special categories
var TopicFlags;
(function (TopicFlags) {
    TopicFlags[TopicFlags["Idle"] = 0] = "Idle";
    TopicFlags[TopicFlags["Recommended"] = 1] = "Recommended";
    TopicFlags[TopicFlags["Hot"] = 2] = "Hot";
    TopicFlags[TopicFlags["New"] = 3] = "New";
})(TopicFlags = exports.TopicFlags || (exports.TopicFlags = {}));
//contentlist, relatively outdated for now
var ContentLists;
(function (ContentLists) {
    ContentLists[ContentLists["Hot"] = 0] = "Hot";
    ContentLists[ContentLists["Recent"] = 1] = "Recent";
    ContentLists[ContentLists["Recommended"] = 2] = "Recommended";
    ContentLists[ContentLists["ScoreToplist"] = 3] = "ScoreToplist";
})(ContentLists = exports.ContentLists || (exports.ContentLists = {}));
/**
 * Used to mark content, especially polls as trending, recommended etc.
 *Example: A poll is trending, cause the score gets high, where ever this poll is now displayed (different points in the app)
 the poll should be marked as trending. This could be done by just asking the server if this specific poll is inside the trending list,
 or alternatively, the poll gets flagged as trending, as long as it is in the trending list.
 **/
var ContentFlags;
(function (ContentFlags) {
    ContentFlags[ContentFlags["Idle"] = 0] = "Idle";
    ContentFlags[ContentFlags["Recommended"] = 1] = "Recommended";
    ContentFlags[ContentFlags["Hot"] = 2] = "Hot";
    ContentFlags[ContentFlags["Controverse"] = 3] = "Controverse";
})(ContentFlags = exports.ContentFlags || (exports.ContentFlags = {}));
//# sourceMappingURL=Constants.js.map