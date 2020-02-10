const jwt = require('jsonwebtoken')
const {userModel} = require('../models/User')

/**
 * Checks JWT Token and passes the user if successfull, fails if not
 */
export = async(req, res, next) => {
    const token = req.header('x-auth-token');
    if(!token){
        res.status(401).json('Access denied. No token provided.')

    }else{
        const data = jwt.verify(token, "DPAJWTKEY")
        try {
            const user = await userModel.findOne({ _id: data._id/*, 'tokens.token': token*/ }).exec()
            if (!user) {
                throw new Error()
            }
            req.body.user = user
            req.token = token
            next()
        } catch (error) {
            console.log(error)
            res.status(401).send({ error: 'Not authorized to access this resource' })
        }}

}
