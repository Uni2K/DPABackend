"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require('express');
const Poll_1 = require("./models/Poll");
const Topic_1 = require("./models/Topic");
const User_1 = require("./models/User");
const userRouter = require('./routers/UserRouter')(Poll_1.pollModel, User_1.userModel, Topic_1.topicModel, express);
const questionRouter = require('./routers/QuestionRouter')(Poll_1.pollModel, User_1.userModel, Topic_1.topicModel, express);
const topicRouter = require('./routers/TopicRouter')(Poll_1.pollModel, User_1.userModel, Topic_1.topicModel, express);
const contentlistcRouter = require('./routers/ContentlistRouter')(Poll_1.pollModel, User_1.userModel, Topic_1.topicModel, express);
const port = 3000;
require('./db/Database');
const app = express();
app.use(express.json()); //FOR POST/GET/PUT/... Requests
app.use(userRouter);
app.use(questionRouter);
app.use(topicRouter);
app.use(contentlistcRouter);
const server = app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
//const io = require('socket.io').listen(server);
/*io.on("connection", socket => {
    require('./content/listeners')(socket,io)

})*/
//# sourceMappingURL=app.js.map