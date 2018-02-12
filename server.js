var express = require('express');
var bodyParser = require('body-parser');
var fs = require('fs')
var http = require('http');

var app = express();
var router = express.Router()

const rawData = JSON.parse(fs.readFileSync('./card_data_v1.json', 'utf8'))
app.use(bodyParser.json());

router.get('/', (req, res) => {
  res.json(rawData)
})

app.use('/api/v1', router)

// Initialize the app.
var server = app.listen(process.env.PORT || 8080, function () {
  var port = server.address().port;
  console.log("RWS API Server now running on port", port);
})
