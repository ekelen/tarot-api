# Tarot Card API

Provides information parsed from AE Waite's The Pictorial Key to the Tarot in OpenAPI 3 format (sorta).

> For all your cybermysticism needs. 🔮

## 2020/10/17

- Now supports CORS, so you can use this pretty much anywhere 🧙‍♂️

e.g. in Node:
```javascript
const axios = require('axios');

axios.get('https://rws-cards-api.herokuapp.com/api/v1/cards/random?n=10')
  .then(function (response) {
    // handle ten random cards
  })
  .catch(function (error) {
	  // handle what went wrong
  })
```

-----

## Usage

| GET path  | Result | Params |
| :--- | --- | :--- |
| `/` or `/cards`  | return all cards  |   |
| `/api/v1/cards/:name_short`  | return card with specified `name_short`  |  **minors:** `/swac`, `/wa02`, ..., `/cupa`, `/pequ`, `/waqu`, `/swki`, **majors** `/ar01`, `/ar02`, ...`/ar[n]` |
| `/api/v1/cards/search`  | search all cards  | `q={text}`, `meaning={text}`, `meaning_rev={text}` |
| `/api/v1/cards/random` | get random card(s) | *optional* `n={integer <= 78}` |

### Examples:

Get all cards with word "peace" in meaning (reversed or upright):

https://rws-cards-api.herokuapp.com/api/v1/cards/search?meaning=peace (free dyno == super slow, sorry)

Get 10 random cards:

https://rws-cards-api.herokuapp.com/api/v1/cards/random?n=10

Get the Knight of Wands:

https://rws-cards-api.herokuapp.com/api/v1/cards/wakn
