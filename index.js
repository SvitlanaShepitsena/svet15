var express = require('express');
var app = express();
var path = require('path');
app.engine('html', require('consolidate').handlebars);
app.set('view engine', 'html');
app.set('views', 'app/dist');

var dev = '/app/build/',
    dist = '/app/dist/';

app.set('port', (process.env.PORT || 5000));
app.use(express.static(__dirname + '/app/dist'));

app.get('*', function (req, res) {
    res.sendFile(__dirname+'/index.html');
})


app.listen(app.get('port'), function() {
  console.log("Node app is running at localhost:" + app.get('port'));
});
