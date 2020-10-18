var express = require('express');
var bodyParser = require('body-parser');
var fs = require('fs')
var path = require('path')
import _ from 'lodash'

var app = express();
var router = express.Router()

const root = process.env.NODE_ENV === "production" ? path.join(__dirname, '..') : __dirname

// TODO python: images, format meanings, assign id, nicer homepage

app.use(bodyParser.json());
app.use('/data', express.static(path.join(__dirname, 'data')))

app.get('/', (req, res) => {
  return res.sendFile('data/index.html', { root })
})

app.get('/documentation.yaml', (req, res) => {
  return res.sendFile('data/RWS-card-api.yaml', { root })
})

app.use('/api/v1', router)

router.use((req, res, next) => {
  res.locals.rawData = JSON.parse(fs.readFileSync('data/card_data_v2.json', 'utf8'))
  return next();
})

router.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", '*');
  res.header("Access-Control-Allow-Credentials", true);
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
  res.header("Access-Control-Allow-Headers", 'Origin,X-Requested-With,Content-Type,Accept,content-type,application/json');
  return next();
});

router.get('/', (req, res) => {
  res.json(res.locals.rawData)
})

router.get('/cards', (req, res) => {
  const { cards } = res.locals.rawData
  return res.json({nhits: cards.length, cards}).status(200)
})

router.get('/cards/search', (req, res) => {
  const { cards } = res.locals.rawData
  if (!req.query)
    return res.redirect('/cards')
  let filteredCards = _.cloneDeep(cards)
  for (let k in req.query) {
    if (k !== 'q') {
      if (k === 'meaning') {
        filteredCards = filteredCards.filter(c => [c.meaning_up, c.meaning_rev].join().toLowerCase().includes(req.query[k].toLowerCase()))
      } else {
      filteredCards = filteredCards.filter(c => c[k] && c[k].toLowerCase().includes(req.query[k].toLowerCase()))
      }
    } else if (k === 'q') {
      filteredCards = filteredCards.filter(c => Object.values(c).join().toLowerCase().includes(req.query[k].toLowerCase()))
    }
  }
  return res.json({nhits: filteredCards.length, cards: filteredCards}).status(200)
})

router.get('/cards/random', function(req, res) {
  const { cards } = res.locals.rawData
  let n = 1
  if (req.query.n && _.inRange(req.query.n, 1, 79)) {
    n = req.query.n
  }
  let cardPool = _.cloneDeep(cards)
  let returnCards = []
  for (let i = 0; i < n; i++) {
    let id = Math.floor(Math.random() * (78 - i))
    let card = cardPool[id]
    returnCards = _.concat(returnCards, _.remove(cardPool, (c) => (c.name_short === card.name_short)))
  }
  return res.json({nhits: returnCards.length, cards: returnCards})
})

router.get('/cards/:id', (req, res, next) => {
  const { cards } = res.locals.rawData
  const card = cards.find(c => c.name_short === req.params.id)
  if (_.isUndefined(card))
    return next();
  return res.json({nhits: 1, card}).status(200)
})

router.get('/cards/suits/:suit', (req, res, next) => {
  const { cards } = res.locals.rawData
  const cardsOfSuit = cards.filter(c => c.suit === req.params.suit)
  if (!cardsOfSuit.length)
    return next();
  return res.json({nhits: cardsOfSuit.length, cards: cardsOfSuit}).status(200)
})

router.get('/cards/courts/:court', (req, res, next) => {
  const { cards } = res.locals.rawData
  const { court } = req.params
  const len = court.length
  const courtSg = court.substr(len - 1) === 's' ? court.substr(0, len - 1) : court
  const cardsOfCourt = cards.filter(c => c.value === courtSg)
  if (!cardsOfCourt.length)
    return next();
  return res.json({nhits: cardsOfCourt.length, cards: cardsOfCourt}).status(200)
})

router.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

router.use(function(err, req, res, next) {
  console.log(err)
  res.status(err.status || 500);
  res.json({error: {status: err.status, message: err.message}});
});



var server = app.listen(process.env.PORT || 8080, function () {
  var port = server.address().port;
  console.log("RWS API Server now running on port", port);
})
