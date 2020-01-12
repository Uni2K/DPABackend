"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.express = require('express');
const ContentlistLoader_1 = require("./content/ContentlistLoader");
const Constants_1 = require("./helpers/Constants");
const PeriodicRunners_1 = require("./helpers/PeriodicRunners");
const PollBase_1 = require("./helpers/PollBase");
const TopicBase_1 = require("./helpers/TopicBase");
const UserBase_1 = require("./helpers/UserBase");
const mime = require('mime-types');
const multer = require('multer');
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, Constants_1.avatarPath);
    },
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + req.body.user + "-" + Date.now() + ".png");
    }
});
exports.upload = multer({ storage: storage, limits: {
        fileSize: 10000000 //10MB
    }, });
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