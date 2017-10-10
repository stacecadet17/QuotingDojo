var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var mongoose = require('mongoose');

app.use(bodyParser.urlencoded({ extended: true }));
var path = require('path');

app.use(express.static(path.join(__dirname, './static')));
app.set('views', path.join(__dirname, './views'));
app.set('view engine', 'ejs');

mongoose.connect('mongodb://localhost/quotes');

var QuoteSchema = new mongoose.Schema({ //creating new db
  name: String,
  quote: String,
  created_at: {type: Date, default: Date.now}
});

var Quotes = mongoose.model('Quotes', QuoteSchema);


app.get('/', function(req, res) {
    res.render('index.ejs');
})


app.post('/quotes', function(req, res) {
    console.log("POST DATA", req.body);
    var userquote = new Quotes({name: req.body.name, quote:req.body.quote});

    userquote.save(function(err) {
      if(err) {
        console.log("there was an error");
      } else{
        console.log("successfully added new quote!");
        res.redirect('/quotes');
      }
    })
  })

app.get('/quotes', function(req, res) {
  console.log('Going to see the quotes now!');
  Quotes.find({}, function(err, quotes) {
    if (err){
      console.log(err, 'there was an error');
      res.redirect('/');
    }
    else {
      res.render('quotes.ejs', {quotes: quotes});
    }
  }).sort({'created_at': -1})
});

// Setting our Server to Listen on Port: 8000
app.listen(8000, function() {
    console.log("listening on port 8000");
})
