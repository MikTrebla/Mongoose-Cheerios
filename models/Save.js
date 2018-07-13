var mongoose = require("mongoose");

var Schema = mongoose.Schema;

var SaveSchema = new Schema({
  title: {
    type: String,
  },
  link: {
    type: String,
    unique:true
  },
  img: {
    type: String,
    default: '../images/download.png'
  },
  summary: {
    type: String,
  },
  note: {
    type: Schema.Types.ObjectId,
    ref: "Note"
  }
});

var Article = mongoose.model("Save", SaveSchema);

module.exports = Article;