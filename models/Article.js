var mongoose = require("mongoose");

var Schema = mongoose.Schema;

var ArticleSchema = new Schema({
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
  }
  
});

var Article = mongoose.model("Article", ArticleSchema);

module.exports = Article;