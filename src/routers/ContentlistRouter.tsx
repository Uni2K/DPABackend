import {Router} from "express";
import {contentlistLoader, express} from "../app";
import { ContentlistLoader } from "../content/ContentlistLoader";
import {pollModel} from "../models/Poll";
import {topicModel} from "../models/Topic";
import {userModel} from "../models/User";

/**
 * Express router for handling anything related to content lists
 */
export = function():Router {
    const router:Router = express.Router();


    router.post("/contentlist",  async (req, res) => {

       const result=  await contentlistLoader.getContent(req)
        res.status(200).send(result)


    });



    return router;
};
