var mongoose = require("mongoose");

var Schema = mongoose.Schema;

// articles schema constructor
var ArticleSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    link: {
        type: String,
        required: true
    },
    img: {
        type: String,
        required: true
    },
    summary: {
        type: String,
        required: true
    }
    ,
    note: {
        type: Schema.Types.ObjectId,
        ref: "Note"
    }
});

// creates out model using mongoose models methods
var Article = mongoose.model("Article", ArticleSchema);

// exporting the article model
module.exports = Article;