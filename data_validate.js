var jsonfile = require('jsonfile')
var path = require('path')
var assert = require('assert')
import _ from 'lodash'

const root = __dirname + '/data'

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
    assert((c.meaning_rev && c.meaning_rev.length) || c.name_short === 'cu02', 'Bad meaning_rev for ' + c.name_short)
    assert(c.type && ["major", "minor"].includes(c.type), 'Bad type for ' + c.name_short)
  })

  cards.filter(c => c.type === 'minor').forEach((c, i) => {
    assert(c.suit && c.suit.length, 'Has no suit for ' + c.name_short)
  })

  console.log('All good.')
}
