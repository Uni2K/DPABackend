import {Router} from "express";
import {express} from "../app";
import { ContentlistLoader } from "../content/ContentlistLoader";
import {pollModel} from "../models/Poll";
import {topicModel} from "../models/Topic";
import {userModel} from "../models/User";

export = function():Router {
    const router:Router = express.Router();

    const contentlistLoader = new ContentlistLoader(pollModel,userModel,topicModel)
    router.post("/contentlist",  async (req, res) => {

       const result=  await contentlistLoader.getContent(req)
        res.status(200).send(result)


    });



    return router;
};
