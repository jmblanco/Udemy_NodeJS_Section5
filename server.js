const express = require('express');
const hbs = require('hbs');
const fs = require('fs');

const port = process.env.PORT || 3000;

var app = express();

var maintenance = false;

// Setting view engine HBS
app.set('view engine', 'hbs');

// Support partial files
hbs.registerPartials(__dirname + '/views/partials');

hbs.registerHelper('getCurrentYear', () => new Date().getFullYear());
hbs.registerHelper('screamIt', (text) => text.toUpperCase());

app.use((req, res, next) => {
    var now = new Date().toString();
    var log = `${now}: ${req.method} ${req.url}`;
    console.log(log);
    fs.appendFile('logs/server.log', log + '\n', (error) => {
        if (error) {
            console.log('Unable to append to server.log');
        }
    });
    next();
});

if (maintenance) {
    app.use((req, res, next) => {
        res.render('maintenance.hbs');
    });
}


// Establish static directory
app.use(express.static(__dirname + '/public'));

app.get('/', (req, res) => {
    //res.send('<h1>Hello Express!!!</h1>');
    // res.send({
    //     name: 'Jose',
    //     likes: [
    //         'Biking',
    //         'Cities'
    //     ]
    // });
    res.render('home.hbs', {
        pageTitle: 'Home Page',
        welcomeMessage: 'Welcome to this webpage, is Awesome!!!'
    });
});

app.get('/about', (req, res) => {
    //res.send('About Page');
    res.render('about.hbs', {
        pageTitle: 'About Page'
    });
});

app.get('/bad', (req, res) => {
    res.send({
        errorMessage: 'Unable to fullfil the request'
    });
});

app.listen(port, () => {
    console.log(`Server is up on port ${port}`);
});