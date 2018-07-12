const cheerio = require('cheerio');
// const axio = require('axios');
const request = require('request');
const express = require('express');
const exphbs = require('express-handlebars');
const bodyParser = require('body-parser');
const mongojs = require('mongojs');
const app = express();

const databaseUrl = 'mongoose';
const collections = ['scrapedData'];
const db = mongojs(databaseUrl, collections);

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

db.on('error', error => {
    console.log('Database Error:', error);
})




function scrapeData () {
    request('https://kotaku.com/', (error, response, html) => {
        db.scrapedData.drop();
        let $ = cheerio.load(html);
        let results = [];
        $('article.postlist__item').each((i, element) => {
            let title = $(element).find('h1').children().text();
            let link = $(element).children().find('a.js_entry-link').attr('href');
            let img = $(element).children().find('source').data('srcset');
            let summary = $(element).children().find('p').text();
    
            results.push({
                link: link,
                title: title,
                summary: summary,
                img: img,
            });
        });
        console.log(results);
        for (var i = 0; i < results.length; i++) {
            let obj = results[i];
            if (!results[i].img && results[i].title) {
                db.scrapedData.insert({
                    link: obj.link,
                    title: obj.title,
                    summary: obj.summary,
                    img: '/images/download.png'
                });
            } else if (!results[i].title && results[i].img) {
                let str = obj.summary;
                let newTitle = str.substr(0, 10);
                db.scrapedData.insert({
                    link: obj.link,
                    summary: obj.summary,
                    title: newTitle + '...',
                    img: obj.img
                });
            } else if (!results[i].title && !results[i].img) {
                let str = obj.summary;
                let newTitle = str.substr(0, 20);
                db.scrapedData.insert({
                    link: obj.link,
                    summary: obj.summary,
                    title: newTitle + '...',
                    img: '/images/download.png'
                });
            } else {
                db.scrapedData.insert({
                    link: obj.link,
                    title: obj.title,
                    summary: obj.summary,
                    img: obj.img
                });
            }
        };
    });
    
}

app.get('/', (req, res) => {
    scrapeData();
    db.scrapedData.find({}, (err, results) => {
        res.render('index', results);
    })
});

app.listen(3000, function () {
    console.log('App running on port 3000!');
});