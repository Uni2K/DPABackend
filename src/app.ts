const express = require('express')
import {pollModel} from "./models/Poll"
import {topicModel} from "./models/Topic"
import {userModel} from "./models/User"



const userRouter = require('./routers/UserRouter')(pollModel,userModel,topicModel,express)
const questionRouter = require('./routers/QuestionRouter')(pollModel,userModel,topicModel,express)
const topicRouter = require('./routers/TopicRouter')(pollModel,userModel,topicModel,express)
const contentlistcRouter = require('./routers/ContentlistRouter')(pollModel,userModel,topicModel,express)

const port = 3000



require('./db/Database')

const app = express()
app.use(express.json()) //FOR POST/GET/PUT/... Requests
app.use(userRouter)
app.use(questionRouter)
app.use(topicRouter)
app.use(contentlistcRouter)
const server = app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});


//const io = require('socket.io').listen(server);
/*io.on("connection", socket => {
    require('./content/listeners')(socket,io)

})*/



