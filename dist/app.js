const express = require('express');
const userModel = require("./models/User");
const pollModel = require("./models/Poll");
const topicModel = require("./models/Topic");
const userRouter = require('./routers/userRouter')(pollModel, userModel, topicModel, express);
const questionRouter = require('./routers/questionRouter')(pollModel, userModel, topicModel, express);
const topicRouter = require('./routers/topicRouter')(pollModel, userModel, topicModel, express);
const port = 3000;
require('./db/Database');
const app = express();
app.use(express.json()); //FOR POST/GET/PUT/... Requests
app.use(userRouter);
app.use(questionRouter);
app.use(topicRouter);
const server = app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
//const io = require('socket.io').listen(server);
/*io.on("connection", socket => {
    require('./content/listeners')(socket,io)

})*/
//# sourceMappingURL=app.js.map