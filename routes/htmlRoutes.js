var db = require("../models/index");

module.exports = function (app) {

    // default route. Pulls in the articles.
    app.get("/", function (req, res) {
        db.Article.find({})
        .then(function (dbArticles) {
            return res.render("index", {
                Article: dbArticles
            }).then(function (dbNotes) {
                return res.render("index", {
                    Note: dbNotes
                })
            });
        });
    });

    // route for the notes
    app.get("/notes", function (req, res) {
        db.Note.find({})
        .then(function (resNotes) {
            return res.render("notes", {
                Note: resNotes
            })
        });
    });


    // routes for the articles
    app.get("/articles", function (req, res) {
        db.Article.find({})
        .then(function (resArt) {
            return res.render("articles", {
                Article: resArt
            })
        });
    });

};
