const cheerio = require('cheerio');
const axios = require('axios');
const express = require('express');
const exphbs = require('express-handlebars');
const bodyParser = require('body-parser');
const logger = require('morgan');
const mongoose = require("mongoose");


const app = express();

const PORT = process.env.PORT || 3000;

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

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/mongoose-cheerios";
mongoose.Promise = Promise;
mongoose.connect(MONGODB_URI);
const db = require("./models");


app.get('/', (req, res) => {
    db.Article.find({}, (err, results) => {
        if (err) {
            console.log(err)
        } else {
            res.render('index', results);
        }
    });
});

app.get('/scrape', (req, res) => {
    axios.get('https://kotaku.com/').then(response => {
        let $ = cheerio.load(response.data);
        let results = [];

        $('article.postlist__item').each(function (i, element) {
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

        db.Article.create(results).then(dbArticle => {
            console.log(dbArticle);
            res.send('Scraped');
        }).catch(err => {
            console.log(err);
        });
    });
})

app.get('/note/:id', (req, res) => {
    db.Article.findOne({
            _id: req.params.id
        }).populate('note')
        .then(dbArticle => {
            res.json(dbArticle.note);
        }).catch(err => {
            res.json(err);
        })
});

app.post('/note/:id', (req, res) => {
    db.Note.create(req.body).then(dbNote => {
        return db.Article.findOneAndUpdate({
            _id: req.params.id
        }, {
            note: dbNote._id
        }, {
            new: true
        });
    }).then(dbArticle => {
        res.send('note saved');
    }).catch(err => {
        res.json(err);
    });
})






app.get('/savedarticles', (req, res) => {
    db.Save.find({}).then(dbSave => {
        res.render('saved', dbSave);
    });
});


app.post('/api/savedarticles/:id', (req, res) => {
    db.Article.find({
        _id: req.params.id
    }).then(results => {
        console.log(results);
        db.Save.create({
            img: results[0].img,
            title: results[0].title,
            summary: results[0].body,
            link: results[0].link
        }).then(dbSave => {
            // console.log(dbSave);
            res.json(dbSave);
        })
    }).catch(err => {
        res.json(err);
    })

})

app.delete('/api/savedarticles/:id', (req, res) => {
    db.Save.deleteOne({
        _id: req.params.id
    }).then(result => {
        res.json(result)
    })
})


app.listen(PORT, function () {
    console.log('App running on port ' + PORT + '!');
});