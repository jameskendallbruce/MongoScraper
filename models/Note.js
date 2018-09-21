var mongoose = require("mongoose");

var Schema = mongoose.Schema;

// schema constructor
var NoteSchema = new Schema({
    title: String,
    body: String
});

// creates our model from the schema
var Note = mongoose.model("Note", NoteSchema);

// export the note model
module.exports = Note;