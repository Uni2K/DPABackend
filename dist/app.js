"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require('express');
const PollBase_1 = require("./helpers/PollBase");
const TopicBase_1 = require("./helpers/TopicBase");
const UserBase_1 = require("./helpers/UserBase");
const Poll_1 = require("./models/Poll");
const Topic_1 = require("./models/Topic");
const User_1 = require("./models/User");
const statisticsBase = require('./helpers/StatisticsBase');
const topicBase = new TopicBase_1.TopicBase(Poll_1.pollModel, User_1.userModel, Topic_1.topicModel);
const userBase = new UserBase_1.UserBase(Poll_1.pollModel, User_1.userModel, Topic_1.topicModel);
const pollBase = new PollBase_1.PollBase(Poll_1.pollModel, User_1.userModel, Topic_1.topicModel);
const userRouter = require('./routers/UserRouter')(Poll_1.pollModel, User_1.userModel, Topic_1.topicModel, express);
const questionRouter = require('./routers/QuestionRouter')(Poll_1.pollModel, User_1.userModel, Topic_1.topicModel, express); //TODO stop this constructor injection bullshit -> how to reference to this "class/file"?
const topicRouter = require('./routers/TopicRouter')(topicBase, Poll_1.pollModel, User_1.userModel, Topic_1.topicModel, express);
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