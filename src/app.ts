export const express = require('express')
import {PollBase} from "./helpers/PollBase";
import {TopicBase} from "./helpers/TopicBase";
import {UserBase} from "./helpers/UserBase";


export const statisticsBase=  require('./helpers/StatisticsBase')
export const topicBase:TopicBase=  new TopicBase()
export const userBase:UserBase=  new UserBase()
export const pollBase:PollBase=  new PollBase()


export const userRouter = require('./routers/UserRouter')()
export const questionRouter = require('./routers/PollRouter')()
export const topicRouter = require('./routers/TopicRouter')()
export const contentlistcRouter = require('./routers/ContentlistRouter')()

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



