# Tarot Card API

> For all your cybermysticism needs. 🔮

Provides information parsed from AE Waite's The Pictorial Key to the Tarot, meeting the OpenAPI 3 spec. This was created as a friendly introduction to REST APIs with ExpressJS.

---

## API Usage

1. [See full documentation + play with the API on SwaggerHub](https://app.swaggerhub.com/apis/ekswagger/rws-tarot_card_api/1.0.0)

2. See below for quick start

### Quick start

Node:

```javascript
import axios from "axios"; // or CommonJS require syntax

axios
  .get("https://rws-cards-api.herokuapp.com/api/v1/cards/random?n=10")
  .then(function (response) {
    // handle ten random cards
  })
  .catch(function (error) {
    // handle what went wrong
  });
```

### Condensed documentation

| GET path                      | Result                                  | Params                                                                                                          |
| :---------------------------- | --------------------------------------- | :-------------------------------------------------------------------------------------------------------------- |
| `/api/v1/` or `/api/v1/cards` | return all cards                        |                                                                                                                 |
| `/api/v1/cards/:name_short`   | return card with specified `name_short` | **minors:** `/swac`, `/wa02`, ..., `/cupa`, `/pequ`, `/waqu`, `/swki`, **majors** `/ar01`, `/ar02`, ...`/ar[n]` |
| `/api/v1/cards/search`        | search all cards                        | `q={text}`, `meaning={text}`, `meaning_rev={text}`                                                              |
| `/api/v1/cards/random`        | get random card(s)                      | _optional_ `n={integer <= 78}`                                                                                  |

### Examples:

Get all cards with word "peace" in meaning (reversed or upright):

https://rws-cards-api.herokuapp.com/api/v1/cards/search?meaning=peace (free dyno == super slow, sorry)

Get 10 random cards:

https://rws-cards-api.herokuapp.com/api/v1/cards/random?n=10

Get the Knight of Wands:

https://rws-cards-api.herokuapp.com/api/v1/cards/wakn

---

## 💻 Local development

(Novice-friendly!)

1. You are welcome to [just grab the JSON file](./static/card_data.json) that serves as the data source and use it for your own projects.

2. Clone or fork this repository and install dependencies locally. Requires Node 10.0.0 or higher, and npm 6.0.0 or higher.

```sh
git clone https://github.com/ekelen/tarot-api.git
# or git@github.com:ekelen/tarot-api.git

# -OR- click fork on this project's Github page, then:

git clone https://github.com/YOUR-USERNAME/tarot-api.git
```

Then:

```sh
cd tarot-api

npm install

npm run dev
```

---

## 🗞 Updates

### 2021/01/25

- Linted, finished, and published the Swagger documentation
- Removed unused packages
- Reorganized source files to remove extraneous files from build
- Updated other documentation

### 2020/10/17

- Now supports CORS, so you can use this pretty much anywhere 🧙‍♂️
