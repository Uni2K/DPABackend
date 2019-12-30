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
const jwt = require('jsonwebtoken');
const userModel = require('../models/User');
module.exports = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const token = req.header('Authorization').replace('Bearer ', '');
    if (token.length == 0) {
        res.status(402).send({ error: 'No JWT' });
    }
    else {
        const data = jwt.verify(token, "DPAJWTKEY");
        try {
            const user = yield userModel.findOne({ _id: data._id, 'tokens.token': token }).exec();
            if (!user) {
                throw new Error();
            }
            req.user = user;
            req.token = token;
            next();
        }
        catch (error) {
            res.status(401).send({ error: 'Not authorized to access this resource' });
        }
    }
});
//# sourceMappingURL=auth.js.map