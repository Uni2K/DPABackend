"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.express = require('express');
const ContentlistLoader_1 = require("./content/ContentlistLoader");
const FeedLoader_1 = require("./content/FeedLoader");
const Constants_1 = require("./helpers/Constants");
const PeriodicRunners_1 = require("./helpers/PeriodicRunners");
const PollBase_1 = require("./helpers/PollBase");
const PoolBase_1 = require("./helpers/PoolBase");
const SnapshotsBase_1 = require("./helpers/SnapshotsBase");
const TopicBase_1 = require("./helpers/TopicBase");
const UserBase_1 = require("./helpers/UserBase");
//Bases
exports.topicBase = new TopicBase_1.TopicBase();
exports.userBase = new UserBase_1.UserBase();
exports.pollBase = new PollBase_1.PollBase();
exports.poolBase = new PoolBase_1.PoolBase();
exports.feedLoader = new FeedLoader_1.FeedLoader();
exports.snapshotBase = new SnapshotsBase_1.SnapshotsBase();
//Routers
exports.userRouter = require('./routers/UserRouter')();
exports.questionRouter = require('./routers/PollRouter')();
exports.topicRouter = require('./routers/TopicRouter')();
exports.contentlistcRouter = require('./routers/ContentlistRouter')();
//Misc
exports.contentlistLoader = new ContentlistLoader_1.ContentlistLoader();
exports.periodicRunners = new PeriodicRunners_1.PeriodicRunners();
const mime = require('mime-types');
const multer = require('multer'); //Image Uploading, Multipart etc.
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
const port = 3000;
//init DB
require('./db/Database');
//Express
const app = exports.express();
app.use(exports.express.json()); //FOR POST/GET/PUT/... Requests
app.use(exports.userRouter);
app.use(exports.questionRouter);
app.use(exports.topicRouter);
app.use(exports.contentlistcRouter);
//Run
const server = app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
//Not now:
//const io = require('socket.io').listen(server);
/*io.on("connection", socket => {
    require('./content/listeners')(socket,io)

})*/
//# sourceMappingURL=app.js.map