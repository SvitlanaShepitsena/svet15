var express = require('express');
var app = express();
var path = require('path');
var bodyParser = require('body-parser'),
    methodOverride = require('method-override');

var dev = 'app/build/',
    dist = 'app/dist/';

app.set('port', (process.env.PORT || 5000));
app.use(express.static(__dirname + './app/dist'));
app.set('view engine', 'jade');
app.use(bodyParser.urlencoded({extended: false}))
app.use(methodOverride());

app.get('*', function (req, res) {
    res.render('index');
})


app.listen(app.get('port'), function() {
  console.log("Node app is running at localhost:" + app.get('port'));
});
