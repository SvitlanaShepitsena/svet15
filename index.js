var express = require('express');
var app = express();
var path = require('path');

var dev = '/app/build/',
    dist = '/app/dist/';

var currentMode = dist;

app.set('port', (process.env.PORT || 5000));
app.use(express.static(__dirname + currentMode));

app.get('*', function (req, res) {
    res.sendFile('index.html', { root: path.join(__dirname, currentMode) });
})


app.listen(app.get('port'), function() {
  console.log("Node app is running at localhost:" + app.get('port'));
});
