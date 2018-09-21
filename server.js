// requiring our various packages
var express = require("express");
var exphbs = require("express-handlebars");
var bodyParser = require("body-parser");

// Might not use this :/
// var logger = require("morgan");

var mongoose = require("mongoose");
var cheerio = require("cheerio");
var request = require("request");

var PORT = process.env.PORT || 3000;

var db = require("./models");

var app = express();

//  Use morgan logger for logging requests--might not use...
// app.use(logger("dev"));

// // Use body-parser for handling form submissions
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static("public"));

//setting up handlebars adn it's engine
app.engine("handlebars", exphbs({defaultLayout:"main"}));
app.set("view engine", "handlebars")

// // Connect to the Mongo DB
var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/mongo_scraper";
mongoose.Promise = Promise;
mongoose.connect(MONGODB_URI);


// routes
// require("./routes/apiRoutes")(app);
require("./routes/htmlRoutes")(app);



app.get("/api/fetch", function (req, res) {
    request("https://www.cartoonbrew.com/", function (err, response, html) {

        var $ = cheerio.load(html);

        //select the element from the body, brewbound uses a h3 tag to contain the title and link
        $("article.cb-post-item").each(function (i, element) {
            // empty array to push resutls into
            var results = {}

            // grabbing the thumbnail divs
            var $thumb = $(element).find("div.cb-thumb");
            var $a = $thumb.find("a");
      
            // going deeper in the article div
            var $div = $(element).find("div.cb-post-content");
            var $postHeader = $div.find("header");
            var $posth2 = $postHeader.find("h2.entry-title");
            var $sumDiv = $div.find("div.entry-summary");

            // pulling data from the elements
            var img = $a
                .find("img.attachment-promo-thumb")
                .attr("src");
            var link = $posth2
                .children("a")
                .attr("href");
            var title = $posth2
                .children("a")
                .text();
            var summary = $sumDiv
                .children("p")
                .text();

            //results array will be pushed to the database
            results.title= title;
            results.link= link;
            results.img= img;
            results.summary= summary;

            //adding our data objects to the db
            db.Article.findOne({ title: results.title }).then(function (dbArticle) {
                if (dbArticle) {
                    console.log("Already exists in database");

                } else {
                    db.Article.create(results).then(function (dbArticle) {
                        console.log(dbArticle);
                        res.json(dbArticle)
                    });
                };
            });
        });
        // Will send after a successful scrape
        res.json("Scrape Complete")
    });
});

app.get("/articles", function (req, res) {
    db.Article.find({})
    .then(function (results) {
        res.json(results)
    })
    .catch(function (err) {
        res.json(err);
    });
});

app.get("/articles/:id", function (req, res) {
    db.Article.findOne({ _id: req.params.id })
    .populate("note")
    .then(function (dbArticle) {
        res.json(dbArticle);
    })
    .catch(function (err) {
        res.json(err);
    });
});

app.post("/articles/:id", function (req, res) {
    db.Note.create(req.body)
    .then(function (dbNote) {
        return db.Article.findOneAndUpdate({ _id: req.params.id }, { note: dbNote._id }, { new: true })
    })
    .then(function (dbArticle) {
        res.json(dbArticle)
    })
    .catch(function (err) {
        res.json(err)
    });
});



// Start the server
app.listen(PORT, function () {
    console.log("App running at http://localhost:" + PORT);
});
