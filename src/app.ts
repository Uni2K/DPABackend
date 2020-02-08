export const express = require('express')
import {ContentlistLoader} from "./content/ContentlistLoader";
import {avatarPath} from "./helpers/Constants";
import {PeriodicRunners} from "./helpers/PeriodicRunners";
import {PollBase} from "./helpers/PollBase";
import {PoolBase} from "./helpers/PoolBase";
import {TopicBase} from "./helpers/TopicBase";
import {UserBase} from "./helpers/UserBase";


//Bases
export const topicBase:TopicBase=  new TopicBase()
export const userBase:UserBase=  new UserBase()
export const pollBase:PollBase=  new PollBase()


//Routers
export const userRouter = require('./routers/UserRouter')()
export const questionRouter = require('./routers/PollRouter')()
export const topicRouter = require('./routers/TopicRouter')()
export const contentlistcRouter = require('./routers/ContentlistRouter')()

//Misc
export const contentlistLoader = new ContentlistLoader()
export const periodicRunners = new PeriodicRunners()
const mime = require('mime-types')
const multer = require('multer') //Image Uploading, Multipart etc.
const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, avatarPath);
    },
    filename: function(req, file, cb) {
        cb(null, file.fieldname + '-'+req.body.user+"-" + Date.now()+".png");
    }
});

export const upload = multer({ storage: storage ,limits:{
        fileSize:10000000 //10MB
},})



const port = 3000

//init DB
require('./db/Database')

//Express
const app = express()
app.use(express.json()) //FOR POST/GET/PUT/... Requests
app.use(userRouter)
app.use(questionRouter)
app.use(topicRouter)
app.use(contentlistcRouter)


//Run
const server = app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});





//Not now:

//const io = require('socket.io').listen(server);
/*io.on("connection", socket => {
    require('./content/listeners')(socket,io)

})*/



