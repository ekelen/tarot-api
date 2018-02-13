# Tarot Card API

Provides information parsed from AE Waite's The Pictorial Key to the Tarot in OpenAPI 3 format (sorta).

> For all your cybermysticism needs. :crystal_ball:

| GET path  | Result | Params |
| :--- | --- | :--- |
| `/` or `/cards`  | return all cards  |   |
| `/api/v1/cards/:name_short`  | return card with specified `name_short`  |   |
| `/api/v1/cards/search`  | search all cards  | `q={text}`, `meaning={text}`, `meaning_rev={text}` |
| `/api/v1/cards/random` | get random card(s) | *optional* `n={integer <= 78}` |

Examples:

Get all cards with word "peace" in meaning (reversed or upright):

https://rws-cards-api.herokuapp.com/api/v1/cards/search?meaning=peace

Get 10 random cards:

https://rws-cards-api.herokuapp.com/api/v1/cards/random?n=10
