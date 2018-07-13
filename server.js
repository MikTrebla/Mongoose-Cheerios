const cheerio = require('cheerio');
const axios = require('axios');
// const request = require('request');
const express = require('express');
const exphbs = require('express-handlebars');
const bodyParser = require('body-parser');
const logger = require('morgan');
var mongoose = require("mongoose");

// const mongojs = require('mongojs');
const app = express();

// const databaseUrl = 'mongoose';
// const collections = ['scrapedData'];
// const db = mongojs(databaseUrl, collections);
const PORT = 3000;

app.engine('handlebars', exphbs({
    defaultLayout: 'main'
}));
app.set('view engine', 'handlebars');
app.use(
    bodyParser.urlencoded({
        extended: true
    })
);
app.use(bodyParser.json());
app.use(express.static("public"));
app.use(logger("dev"));
mongoose.connect("mongodb://localhost/mongoose-cheerios");
const db = require("./models");


app.get('/', (req, res) => {
    db.Article.find({}, (err, results) => {
        res.render('index', results);
    });
});

app.get('/scrape', (req, res) => {
    axios.get('https://kotaku.com/').then(response => {
        let $ = cheerio.load(response.data);
        let results = [];

        $('article.postlist__item').each(function (i, element) {
            // console.log('hit2');
            results.title = $(this).find('h1').children().text();
            results.link = $(this).children().find('a.js_entry-link').attr('href');
            results.img = $(this).children().find('source').data('srcset');
            results.summary = $(this).children().find('p').text();
            if (!results.title) {
                var str = results.summary;
                var title = str.substr(0, 50) + '...'
                results.push({
                    link: results.link,
                    title: title,
                    summary: results.summary,
                    img: results.img,
                });
            } else {
                results.push({
                    link: results.link,
                    title: results.title,
                    summary: results.summary,
                    img: results.img,
                });
            }

        });
        console.log(results);

        db.Article.create(results).then(dbArticle => {
            console.log(dbArticle);
        }).catch(err => {
            console.log(err);
        });
    });
    res.send('success');
})

app.post('/note/:id', (req, res) => {
    db.Note.create(req.body).then(dbNote => {
        return db.Article.findOneAndUpdate({
            id: req.params.id,
            note: dbNote._id,
            new: true
        })
    }).then(dbArticle => {
        res.send('note saved');
        // res.json(dbArticle);
    }).catch(err => {
        res.json(err);
    });
})






// app.get('/savedarticles', (req, res) => {
//     db.Save.find({})
//     .populate('Article').
//     then(dbSave => {
//         res.send(dbSave);
//     });
// });

// app.post('/api/savedarticles/:id', (req, res) => {
//     db.Save.create({
//         id: req.params.id
//     }).then(dbSave => {
//         res.send('save success');
//     })
// })


app.listen(PORT, function () {
    console.log('App running on port ' + PORT + '!');
});