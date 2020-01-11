"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CONTENTLIST_SIZE = 1000;
exports.INTERVAL_CONTENTLIST_REFRESH = 15000;
exports.INTERVAL_SNAPSHOT_CREATION = 15000;
exports.REQUEST_OK = 200;
exports.ERROR_USER_UNKNOWN = "400";
exports.ERROR_USER_NAME = "305";
exports.ERROR_USER_EMAIL = "306";
exports.ERROR_USER_PW = "307";
exports.ERROR_USER_DUPLICATE_SUB = "308";
exports.ERROR_USER_LOGIN_FAILED = "309";
exports.ERROR_USER_AUTH = "310";
exports.ERROR_USER_REPUTATION_NOT_ENOUGH = "311";
exports.TRIBUT_CREATE_DEFAULT = 5;
exports.TRIBUT_CREATE_DEFAULT_IMAGE = 10;
exports.TRIBUT_CREATE_DEEP = 100;
exports.TRIBUT_CREATE_TOF = 20;
exports.TRIBUT_CREATE_LOCAL = 2;
exports.TRIBUT_CREATE_PRIVATESUB = 5;
exports.TRIBUT_CREATE_PRIVATESTRICT = 5;
exports.TRIBUT_CREATE_THREAD = 15;
exports.TRIBUT_CREATE_DURATION_IMAGE = 10;
exports.REPUTATION_VOTE = 10;
exports.REPUTATION_REPORT = 10;
exports.REPUTATION_COMMENT = 20;
exports.REPUTATION_GETFLAGGED = -10;
exports.REPUTATION_DUPLICATE = -10;
var PollTypeFlags;
(function (PollTypeFlags) {
    PollTypeFlags[PollTypeFlags["Idle"] = 0] = "Idle";
    PollTypeFlags[PollTypeFlags["Local"] = 1] = "Local";
    PollTypeFlags[PollTypeFlags["PrivateSubs"] = 2] = "PrivateSubs";
    PollTypeFlags[PollTypeFlags["PrivateStrict"] = 3] = "PrivateStrict";
    PollTypeFlags[PollTypeFlags["Thread"] = 4] = "Thread";
    PollTypeFlags[PollTypeFlags["Limited"] = 5] = "Limited";
})(PollTypeFlags = exports.PollTypeFlags || (exports.PollTypeFlags = {}));
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
var PollTypes;
(function (PollTypes) {
    PollTypes[PollTypes["Default"] = 0] = "Default";
    PollTypes[PollTypes["Deep"] = 1] = "Deep";
    PollTypes[PollTypes["ToF"] = 2] = "ToF";
})(PollTypes = exports.PollTypes || (exports.PollTypes = {}));
var PollDurations;
(function (PollDurations) {
    PollDurations[PollDurations["hour"] = 0] = "hour";
    PollDurations[PollDurations["day"] = 1] = "day";
    PollDurations[PollDurations["week"] = 2] = "week";
    PollDurations[PollDurations["month"] = 3] = "month";
    PollDurations[PollDurations["unlimited"] = 4] = "unlimited";
})(PollDurations = exports.PollDurations || (exports.PollDurations = {}));
var TopicFlags;
(function (TopicFlags) {
    TopicFlags[TopicFlags["Idle"] = 0] = "Idle";
    TopicFlags[TopicFlags["Recommended"] = 1] = "Recommended";
    TopicFlags[TopicFlags["Hot"] = 2] = "Hot";
    TopicFlags[TopicFlags["New"] = 3] = "New";
})(TopicFlags = exports.TopicFlags || (exports.TopicFlags = {}));
var ContentLists;
(function (ContentLists) {
    ContentLists[ContentLists["Hot"] = 0] = "Hot";
    ContentLists[ContentLists["Recent"] = 1] = "Recent";
    ContentLists[ContentLists["Recommended"] = 2] = "Recommended";
    ContentLists[ContentLists["ScoreToplist"] = 3] = "ScoreToplist";
})(ContentLists = exports.ContentLists || (exports.ContentLists = {}));
var ContentFlags;
(function (ContentFlags) {
    ContentFlags[ContentFlags["Idle"] = 0] = "Idle";
    ContentFlags[ContentFlags["Recommended"] = 1] = "Recommended";
    ContentFlags[ContentFlags["Hot"] = 2] = "Hot";
    ContentFlags[ContentFlags["Controverse"] = 3] = "Controverse";
})(ContentFlags = exports.ContentFlags || (exports.ContentFlags = {}));
//# sourceMappingURL=Constants.js.map