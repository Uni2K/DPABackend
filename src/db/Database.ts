const mongoose = require('mongoose')
const mongoURL:string="mongodb://localhost/local"

mongoose.connect(mongoURL, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
}).then(r => console.log("Database connected!"))
mongoose.set("useFindAndModify", false);
