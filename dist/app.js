"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.express = require('express');
const ContentlistLoader_1 = require("./content/ContentlistLoader");
const PeriodicRunners_1 = require("./helpers/PeriodicRunners");
const PollBase_1 = require("./helpers/PollBase");
const TopicBase_1 = require("./helpers/TopicBase");
const UserBase_1 = require("./helpers/UserBase");
exports.topicBase = new TopicBase_1.TopicBase();
exports.userBase = new UserBase_1.UserBase();
exports.pollBase = new PollBase_1.PollBase();
exports.userRouter = require('./routers/UserRouter')();
exports.questionRouter = require('./routers/PollRouter')();
exports.topicRouter = require('./routers/TopicRouter')();
exports.contentlistcRouter = require('./routers/ContentlistRouter')();
exports.contentlistLoader = new ContentlistLoader_1.ContentlistLoader();
exports.periodicRunners = new PeriodicRunners_1.PeriodicRunners();
const port = 3000;
require('./db/Database');
const app = exports.express();
app.use(exports.express.json()); //FOR POST/GET/PUT/... Requests
app.use(exports.userRouter);
app.use(exports.questionRouter);
app.use(exports.topicRouter);
app.use(exports.contentlistcRouter);
const server = app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
//const io = require('socket.io').listen(server);
/*io.on("connection", socket => {
    require('./content/listeners')(socket,io)

})*/
//# sourceMappingURL=app.js.map