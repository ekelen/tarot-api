'use strict';

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var express = require('express');
var bodyParser = require('body-parser');
var fs = require('fs');
var path = require('path');


var app = express();
var router = express.Router();

// TODO python: images, format meanings, assign id

app.use(bodyParser.json());
app.use('/data', express.static(path.join(__dirname, 'data')));

app.get('/', function (req, res) {
  return res.sendFile('/data/index.html', { root: __dirname });
});

app.use('/api/v1', router);

router.use(function (req, res, next) {
  res.locals.rawData = JSON.parse(fs.readFileSync('data/card_data_v1.json', 'utf8'));
  return next();
});

router.get('/', function (req, res) {
  res.json(res.locals.rawData);
});

router.get('/cards', function (req, res) {
  var cards = res.locals.rawData.cards;

  return res.json({ count: cards.length, cards: cards }).status(200);
});

router.get('/cards/search', function (req, res) {
  var cards = res.locals.rawData.cards;

  if (!req.query) return res.redirect('/cards');
  var filteredCards = _lodash2.default.cloneDeep(cards);

  var _loop = function _loop(k) {
    if (k !== 'q') {
      if (k === 'meaning') {
        filteredCards = filteredCards.filter(function (c) {
          return [c.meaning_up, c.meaning_rev].join().toLowerCase().includes(req.query[k].toLowerCase());
        });
      } else {
        filteredCards = filteredCards.filter(function (c) {
          return c[k] && c[k].toLowerCase().includes(req.query[k].toLowerCase());
        });
      }
    } else if (k === 'q') {
      filteredCards = filteredCards.filter(function (c) {
        return Object.values(c).join().toLowerCase().includes(req.query[k].toLowerCase());
      });
    }
  };

  for (var k in req.query) {
    _loop(k);
  }
  return res.json({ count: filteredCards.length, cards: filteredCards }).status(200);
});

router.get('/cards/random', function (req, res) {
  var cards = res.locals.rawData.cards;

  var id = Math.floor(Math.random() * 78);
  var card = cards[id];
  return res.json({ count: 1, card: card });
});

router.get('/cards/:id', function (req, res, next) {
  var cards = res.locals.rawData.cards;

  var card = cards.find(function (c) {
    return c.name_short === req.params.id;
  });
  if (_lodash2.default.isUndefined(card)) return next();
  return res.json({ count: 1, card: card }).status(200);
});

router.get('/cards/suits/:suit', function (req, res, next) {
  var cards = res.locals.rawData.cards;

  var cardsOfSuit = cards.filter(function (c) {
    return c.suit === req.params.suit;
  });
  if (!cardsOfSuit.length) return next();
  return res.json({ count: cardsOfSuit.length, cards: cardsOfSuit }).status(200);
});

router.get('/cards/courts/:court', function (req, res, next) {
  var cards = res.locals.rawData.cards;
  var court = req.params.court;

  var len = court.length;
  var courtSg = court.substr(len - 1) === 's' ? court.substr(0, len - 1) : court;
  var cardsOfCourt = cards.filter(function (c) {
    return c.value === courtSg;
  });
  if (!cardsOfCourt.length) return next();
  return res.json({ count: cardsOfCourt.length, cards: cardsOfCourt }).status(200);
});

router.use(function (req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

router.use(function (err, req, res, next) {
  console.log(err);
  res.status(err.status || 500);
  res.json({ error: { status: err.status, message: err.message } });
});

var server = app.listen(process.env.PORT || 8080, function () {
  var port = server.address().port;
  console.log("RWS API Server now running on port", port);
});