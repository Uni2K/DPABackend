const mongoose = require('mongoose');
mongoose.connect(process.env.MONGODB_URL, {
    useNewUrlParser: true,
    useCreateIndex: true,
});
mongoose.set("useFindAndModify", false);
//# sourceMappingURL=db.js.map