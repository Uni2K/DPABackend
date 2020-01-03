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
const app_1 = require("../app");
const ContentlistLoader_1 = require("../content/ContentlistLoader");
const Poll_1 = require("../models/Poll");
const Topic_1 = require("../models/Topic");
const User_1 = require("../models/User");
module.exports = function () {
    const router = app_1.express.Router();
    const contentlistLoader = new ContentlistLoader_1.ContentlistLoader(Poll_1.pollModel, User_1.userModel, Topic_1.topicModel);
    router.post("/contentlist", (req, res) => __awaiter(this, void 0, void 0, function* () {
        const result = yield contentlistLoader.getContent(req);
        res.status(200).send(result);
    }));
    return router;
};
//# sourceMappingURL=ContentlistRouter.js.map