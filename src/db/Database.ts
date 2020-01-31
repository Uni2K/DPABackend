const mongoose = require('mongoose')

//const mongoURL:string="mongodb://localhost/local"
const mongoURL:string = "mongodb://192.168.64.5:27017/localtest";

mongoose.connect(mongoURL, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
}).then(r => console.log("Database connected!"))
mongoose.set("useFindAndModify", false);


