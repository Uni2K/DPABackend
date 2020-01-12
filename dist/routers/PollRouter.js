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
const Constants_1 = require("../helpers/Constants");
module.exports = function () {
    const router = app_1.express.Router();
    router.post("/polls/byIDs", (req, res) => __awaiter(this, void 0, void 0, function* () {
        const ids = req.body.ids;
        app_1.pollBase.getPollsByIds(ids).then((result) => {
            res.status(Constants_1.REQUEST_OK).send(result);
        }).catch((err) => {
            res.status(Constants_1.ERROR_USER_UNKNOWN).send(err);
        });
    }));
    router.post("/polls/search", (req, res) => __awaiter(this, void 0, void 0, function* () {
        app_1.pollBase.searchPolls(req).then((result) => {
            res.status(Constants_1.REQUEST_OK).send(result);
        }).catch((err) => {
            res.status(Constants_1.ERROR_USER_UNKNOWN).send(err);
        });
    }));
    router.post("/polls/snapshot", (req, res) => __awaiter(this, void 0, void 0, function* () {
        app_1.pollBase.getSnapshots(req).then((result) => {
            res.status(Constants_1.REQUEST_OK).send(result);
        }).catch((err) => {
            res.status(Constants_1.ERROR_USER_UNKNOWN).send(err);
        });
    }));
    router.post("/data/creation/metadata", (req, res) => __awaiter(this, void 0, void 0, function* () {
        res.status(Constants_1.REQUEST_OK).send(app_1.pollBase.getCreationMetadata());
    }));
    return router;
};
//# sourceMappingURL=PollRouter.js.map