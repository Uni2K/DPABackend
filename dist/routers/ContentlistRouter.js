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
const { validate } = require("../helpers/Validate");
const Joi = require('@hapi/joi');
module.exports = function () {
    const router = app_1.express.Router();
    router.post("/contentlist", (req, res) => __awaiter(this, void 0, void 0, function* () {
        const schema = Joi.object({
            type: Joi.string().required(),
            index: Joi.number().required(),
            pageSize: Joi.number().required(),
            direction: Joi.string().valid("asc", "desc").required(),
            selectedSort: Joi.string().required()
        });
        yield validate(schema, req, res);
        const result = yield app_1.contentlistLoader.getContent(req);
        res.status(200).send(result);
    }));
    return router;
};
//# sourceMappingURL=ContentlistRouter.js.map