var mongoose = require("mongoose");

var Schema = mongoose.Schema;

var ArticleSchema = new Schema({
  title: {
    type: String,
    default: 'HELLO',
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

var Article = mongoose.model("Article", ArticleSchema);

module.exports = Article;