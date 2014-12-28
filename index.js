var express = require('express');
var app = express();
var path = require('path');

app.set('port', (process.env.PORT || 5000));
app.use(express.static(__dirname + '/app/dist'));
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');

var dev = 'app/build/',
    dist = 'app/dist/';
app.set('views', dist);


app.use(express.static(path.join(__dirname, dist)));

app.get('/', function (req, res) {
    res.sendFile('index.html');
});



app.listen(app.get('port'), function() {
  console.log("Node app is running at localhost:" + app.get('port'));
});
