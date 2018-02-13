var cheerio = require('cheerio')
var jsonfile = require('jsonfile')
var path = require('path')
var async = require('async')
var axios = require('axios')
var moment = require('moment')
var assert = require('assert')
import _ from 'lodash'

const st_base_url = 'http://www.sacred-texts.com/tarot/pkt/pkt'
const st_majors_doc = 'http://www.sacred-texts.com/tarot/pkt/pkt0303.htm'
const root = __dirname + '/data'
const raw_major_filename = root + '/maj_text.json'
const v1_dataset_filename = root + '/card_data_v1.json'
let latest_majors_filename = ''
let latest_filename = ''


async function start() {

  // 1. Scrape complete text. (No worries, won't overwrite.)
  await init(raw_major_filename)

  // 2. Combine data (also won't overwrite.)
  if (latest_majors_filename) combineData(v1_dataset_filename, latest_majors_filename)

  // 3. Validate all data
  if (latest_filename) validate(latest_filename)
  console.log(`All cards added and validated to: ${latest_filename}`)
}

start();


async function getMajDetail(name_short) {
  console.log(st_base_url + name_short + '.htm');
  let res = null
  try {
    res = await axios.get(st_base_url + name_short + '.htm')
  } catch (e) {
    console.log(e.message)
  }
  if (res) {
    const $ = cheerio.load(res.data)
    let pars = []
    $('p').each(function(i, elem) {
      let content = $(this).text()
      if (content.length > 40 && !content.includes('The Pictorial Key to the Tarot'))
        pars.push(content);
    });
    let desc = pars.join('\n')
    return desc
  }
  return ''
}

async function init(rawMajData) {
  const majData = jsonfile.readFileSync(rawMajData)
  let majDataFormatted = []
  for (let major of majData) {
      let cardObj = {}
      cardObj['type'] = "major"
      cardObj['name_short'] = major.name_short
      cardObj['name'] = _.startCase(_.toLower(major.name))
      cardObj['value'] = major.value
      cardObj['value_int'] = major.value === 'ZERO' ? 0 : +major.value
      // Note: a couple of cards don't have -- delimiter.
      const startMeaningUp = major.text.indexOf('--') + 2
      const endMeaningUp = major.text.indexOf(' Reversed')
      cardObj['meaning_up'] = major.text.slice(startMeaningUp, endMeaningUp).trim()
      const startMeaningRev = major.text.indexOf('Reversed:') + 'Reversed:'.length
      cardObj['meaning_rev'] = major.text.slice(startMeaningRev).trim()
      cardObj['desc'] = await getMajDetail(major.name_short)
      majDataFormatted.push(cardObj)
    }
  latest_majors_filename = root + '/scraped_majors_' + moment().format() + '.json'
  jsonfile.writeFileSync(latest_majors_filename, majDataFormatted, {spaces: 2})
}



function combineData(v1Data, majorsData) {
  const rOrig = jsonfile.readFileSync(v1Data)
  const origCards = _.cloneDeep(rOrig.cards)

  const rMaj = jsonfile.readFileSync(majorsData)
  const majCards = _.cloneDeep(rMaj)

  assert(majCards.length === 22, 'Need 22 major cards.')
  assert(origCards.length, 'no orig cards.')

  let origMinors = origCards.filter(c => c.type === "minor")
  assert(origMinors.length === 56, 'Need 56 minor cards.')

  //console.log(origMinors);
  let cardsMerged = [...majCards, ...origMinors]
  assert(cardsMerged.length === 78, 'not enough cards')

  const dataToWrite = { nhits: 78, cards: cardsMerged }

  latest_filename = root + '/card_data_' + moment().format() + '.json'
  jsonfile.writeFileSync(latest_filename, dataToWrite, {spaces: 2})

}

function validate(file) {
  const rOrig = jsonfile.readFileSync(file)
  const { cards } = rOrig
  assert(cards.length === 78, 'incorrect number of cards.')

  cards.forEach((c, i) => {
    assert(c.name && c.name.length, 'Has no name for ' + c.name_short)
    assert(c.name_short && c.name_short.length === 4, 'Bad short name for ' + c.name)
    assert(c.desc && c.desc.length, 'Bad desc for ' + c.name_short)
    assert(_.has(c, 'value_int') && !_.isNaN(c.value_int), 'Bad int val for ' + c.name_short)
    assert(c.value && c.value.length, 'Bad val for ' + c.name_short)
    assert(c.meaning_up && c.meaning_up.length, 'Bad meaning_up for ' + c.name_short)
    assert(c.meaning_rev && c.meaning_rev.length, 'Bad meaning_rev for ' + c.name_short)
    assert(c.type && ["major", "minor"].includes(c.type), 'Bad type for ' + c.name_short)
  })

  cards.filter(c => c.type === 'minor').forEach((c, i) => {
    assert(c.suit && c.suit.length, 'Has no suit for ' + c.name_short)
  })

  console.log('All good.')
}
