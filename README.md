# Tarot Card API

> For all your cybermysticism needs. 🔮

Provides information parsed from AE Waite's The Pictorial Key to the Tarot, meeting the OpenAPI 3 spec. This was created as a friendly introduction to REST APIs.

---

## API Usage

1. [See full documentation + play with the API on SwaggerHub](https://app.swaggerhub.com/apis/ekswagger/tarot-api/1.3)

2. See below for quick start

### Quick start

JS:

```javascript
fetch("https://tarot-api-3hv5.onrender.com/api/v1/cards/random?n=10")
  .then(function (response) {
    return response.json();
  })
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

https://tarot-api-3hv5.onrender.com/api/v1/cards/search?meaning=peace (free dyno == super slow, sorry)

Get 10 random cards:

https://tarot-api-3hv5.onrender.com/api/v1/cards/random?n=10

Get the Knight of Wands:

https://tarot-api-3hv5.onrender.com/api/v1/cards/wakn

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

### 2023/05/12

- **Important** render.com stopped supporting my pretty URL (👎), so the project must be accessed at https://tarot-api-3hv5.onrender.com/.

### 2023/12/30

- **Important** Heroku stopped offering free dynos (👎), so you must replace all references to https://rws-cards-api.herokuapp.com to ~tarot-api.onrender.com~ https://tarot-api-3hv5.onrender.com (see May update) if you are using this API in your app.

### 2022/06/18

- Updated Swagger docs
- Added a `courts` endpoint (no specific rank parameter required)
- Bumped `nodemon`
- `require` typo fix

### 2021/01/25

- Linted, finished, and published the Swagger documentation
- Removed unused packages
- Reorganized source files to remove extraneous files from build
- Updated other documentation

### 2020/10/17

- Now supports CORS, so you can use this pretty much anywhere 🧙‍♂️
