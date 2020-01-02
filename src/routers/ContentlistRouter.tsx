import {Router} from "express";
import { ContentlistLoader } from "../content/ContentlistLoader";

export = function(pollModel,userModel,topicModel,express):Router {
    const router:Router = express.Router();

    const contentlistLoader = new ContentlistLoader(pollModel,userModel,topicModel)
    router.post("/contentlist",  async (req, res) => {

       const result=  await contentlistLoader.getContent(req)
        res.status(200).send(result)


    });



    return router;
};
