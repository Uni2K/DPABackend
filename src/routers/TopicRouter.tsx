
export = function(pollModel,userModel,topicModel,express) {
    const router = express.Router();
    router.post("/topics/all", async (req, res) => {
        const questions = await topicModel.find({enabled: true}).exec();
        res.status(200).send(questions);
    });

    router.post("/topics/details", async (req, res) => {
        const topicID = req.body.topic;
        const query = {};
        query["tags"] = { $in: topicID };

        const questions = await topicModel
            .find(query)
            .count()
            .exec();
        res.status(200).send(questions);
    });
    //createTag()
    return router;
};


function createTag() {
    //NOT CORRECTLY WORKING
  /*  console.log("CREATE TAGS!!");

    var colors = [
        "#212121",
        "#795548",
        "#009688",
        "#5677fc",
        "#673ab7",
        "#607d8b",
        "#9e9e9e",
        "#00bcd4",
        "#03a9f4",
        "#ffeb3b",
        "#9c27b0",
        "#e51c23",
        "#ff9800",
        "#cddc39",
        "#259b24",
        "#e91e63",
        "#ff5722",
        "#ffc107",
        "#ffeb3b",
        "#8bc34a"
    ];
    var content = [
        ["Cars", "Buy", "Sell", "Tune", "Accidents"],
        ["Music", "Rock", "Pop", "Metal", "Classic"],
        ["Books", "Novels", "Sci-Fi", "Shortbooks", "Audiobooks"],
        ["Programming", "Kotlin", "Java", "C++", "C#", "Python", "Swift"],
        ["Art", "Paintings", "Designs"],
        ["Lifestyle", "Cloths", "Make-Up", "Fitness", "Food"],
        ["Games", "Shooter", "Strategy", "MMORPG", "RPG"],
        ["Movies", "Action", "Horror", "Love", "Comedy"],
        [
            "Education",
            "Physics",
            "Chemistry",
            "Biology",
            "Math",
            "History",
            "Sociology"
        ],
        ["Software", "Windows", "iOS", "Linux"],
        [
            "Hardware",
            "Mainboard",
            "RAM",
            "GPU",
            "CPU",
            "HDD",
            "SDD",
            "PCI Extensions",
            "Fans",
            "Tuning"
        ],
        ["Animals", "Dogs", "Cats", "Snakes", "Spiders", "Other Animals"],
        ["Jobs", "Career", "Firing"],
        ["Other", "Fun", "Stories", "Compliments"],
        ["Nature", "Traveling", "Exploring"],
        ["Countries", "Europe", "America", "Africa", "Asia", "Australia"]
    ];

    var contentSize = content.length;
    var colorSize = colors.length;
    topicModel.remove({}, function(err, save) {});

    for (let i = 0; i < contentSize; i++) {
        setTimeout(function() {
            subArraySize = content[i].length;
            tagHeader = content[i][0];
            var cat1 = new topicModel({
                _id: "yy" + i,
                name: tagHeader,
                enabled: true,
                parent: "-1",
                color: colors[i]
            });
            cat1.save(function(err, save) {
                for (let j = 1; j < subArraySize; j++) {

                    if (err) {
                        continue;
                    }

                    var Tag1 = new topicModel({
                        _id: "y" + i + "y" + j,
                        name: content[i][j],
                        enabled: true,
                        parent: save._id,
                        color: colors[i]
                    });

                    Tag1.save(function(err) {
                        // console.log("ERROR: "+j+"   "+err)
                    });
                }
            });
        }, 2000 * (i + 1));
    }*/
}

