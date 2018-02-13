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

var root = process.env.NODE_ENV === "production" ? __dirname + '/../' : __dirname;

// TODO python: images, format meanings, assign id, nicer homepage

app.use(bodyParser.json());
app.use('/data', express.static(path.join(__dirname, 'data')));

app.get('/', function (req, res) {
  return res.sendFile('data/index.html', { root: root });
});

app.get('/documentation.yaml', function (req, res) {
  console.log(process.env.NODE_ENV);
  return res.sendFile('data/RWS-card-api.yaml', { root: root });
});

app.use('/api/v1', router);

router.use(function (req, res, next) {
  res.locals.rawData = JSON.parse(fs.readFileSync('data/card_data_v2.json', 'utf8'));
  return next();
});

router.get('/', function (req, res) {
  res.json(res.locals.rawData);
});

router.get('/cards', function (req, res) {
  var cards = res.locals.rawData.cards;

  return res.json({ nhits: cards.length, cards: cards }).status(200);
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
  return res.json({ nhits: filteredCards.length, cards: filteredCards }).status(200);
});

router.get('/cards/random', function (req, res) {
  var cards = res.locals.rawData.cards;

  var n = 1;
  if (req.query.n && _lodash2.default.inRange(req.query.n, 1, 79)) {
    n = req.query.n;
  }
  var cardPool = _lodash2.default.cloneDeep(cards);
  var returnCards = [];

  var _loop2 = function _loop2(i) {
    var id = Math.floor(Math.random() * (78 - i));
    var card = cardPool[id];
    returnCards = _lodash2.default.concat(returnCards, _lodash2.default.remove(cardPool, function (c) {
      return c.name_short === card.name_short;
    }));
  };

  for (var i = 0; i < n; i++) {
    _loop2(i);
  }
  return res.json({ nhits: returnCards.length, cards: returnCards });
});

router.get('/cards/:id', function (req, res, next) {
  var cards = res.locals.rawData.cards;

  var card = cards.find(function (c) {
    return c.name_short === req.params.id;
  });
  if (_lodash2.default.isUndefined(card)) return next();
  return res.json({ nhits: 1, card: card }).status(200);
});

router.get('/cards/suits/:suit', function (req, res, next) {
  var cards = res.locals.rawData.cards;

  var cardsOfSuit = cards.filter(function (c) {
    return c.suit === req.params.suit;
  });
  if (!cardsOfSuit.length) return next();
  return res.json({ nhits: cardsOfSuit.length, cards: cardsOfSuit }).status(200);
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
  return res.json({ nhits: cardsOfCourt.length, cards: cardsOfCourt }).status(200);
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