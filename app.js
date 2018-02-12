var express = require('express');
var bodyParser = require('body-parser');
var fs = require('fs')
var path = require('path')
import _ from 'lodash'

var app = express();
var router = express.Router()

// TODO python: images, format meanings, assign id

app.use(bodyParser.json());
app.use('/data', express.static(path.join(__dirname, 'data')))

app.get('/', (req, res) => {
  return res.sendFile('/data/index.html')
})

app.use('/api/v1', router)

router.use((req, res, next) => {
  res.locals.rawData = JSON.parse(fs.readFileSync('data/card_data_v1.json', 'utf8'))
  return next();
})

router.get('/', (req, res) => {
  res.json(res.locals.rawData)
})

router.get('/cards', (req, res) => {
  const { cards } = res.locals.rawData
  return res.json({count: cards.length, cards}).status(200)
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
  return res.json({count: filteredCards.length, cards: filteredCards}).status(200)
})

router.get('/cards/random', function(req, res) {
  const { cards } = res.locals.rawData
  const id = Math.floor(Math.random() * 78)
  const card = cards[id]
  return res.json({count: 1, card})
})

router.get('/cards/:id', (req, res, next) => {
  const { cards } = res.locals.rawData
  const card = cards.find(c => c.name_short === req.params.id)
  if (_.isUndefined(card))
    return next();
  return res.json({count: 1, card}).status(200)
})

router.get('/cards/suits/:suit', (req, res, next) => {
  const { cards } = res.locals.rawData
  const cardsOfSuit = cards.filter(c => c.suit === req.params.suit)
  if (!cardsOfSuit.length)
    return next();
  return res.json({count: cardsOfSuit.length, cards: cardsOfSuit}).status(200)
})

router.get('/cards/courts/:court', (req, res, next) => {
  const { cards } = res.locals.rawData
  const { court } = req.params
  const len = court.length
  const courtSg = court.substr(len - 1) === 's' ? court.substr(0, len - 1) : court
  const cardsOfCourt = cards.filter(c => c.value === courtSg)
  if (!cardsOfCourt.length)
    return next();
  return res.json({count: cardsOfCourt.length, cards: cardsOfCourt}).status(200)
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
