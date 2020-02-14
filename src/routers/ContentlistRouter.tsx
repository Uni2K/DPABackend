import {Router} from "express";
import {contentlistLoader, express} from "../app";
const {validate} = require("../helpers/Validate")
const Joi = require('@hapi/joi');

/**
 * Express router for handling anything related to content lists
 */
export = function():Router {
    const router:Router = express.Router();


    router.post("/contentlist",  async (req, res) => {

        const schema = Joi.object({
            type: Joi.string().required(),
            index: Joi.number().required(),
            pageSize: Joi.number().required(),
            direction: Joi.string().valid("asc", "desc").required(),
            selectedSort: Joi.string().required()
        });

        await validate(schema, req, res);

       const result=  await contentlistLoader.getContent(req)
        res.status(200).send(result)


    });



    return router;
};
