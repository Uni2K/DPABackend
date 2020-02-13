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
const { userModel } = require('../models/User');
module.exports = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const token = req.header('x-auth-token');
    if (!token) {
        res.status(401).json('Access denied. No token provided.');
    }
    else {
        const data = jwt.verify(token, "DPAJWTKEY");
        try {
            const user = yield userModel.findOne({ _id: data._id /*, 'tokens.token': token*/ }).exec();
            if (!user) {
                throw new Error();
            }
            req.body.user = user;
            req.token = token;
            next();
        }
        catch (error) {
            console.log(error);
            res.status(401).send({ error: 'Not authorized to access this resource' });
        }
    }
});
//# sourceMappingURL=auth.js.map