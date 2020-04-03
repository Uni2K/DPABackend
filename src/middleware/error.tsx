import {logger} from "../app";

module.exports = function(err, req, res, next){
    logger.error(err.message, err);
    console.log(err)
    res.status(500).json('Something failed');

}
