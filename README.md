# Tarot Card API

Provides information parsed from AE Waite's The Pictorial Key to the Tarot in OpenAPI 3 format (sorta).

> For all your cybermysticism needs. :crystal_ball:

| GET path  | Result | Params |
| :--- | --- | :--- |
| `/` or `/cards`  | return all cards  |   |
| `/cards/:name_short`  | return card with specified `name_short`  |   |
| `/cards/search`  | search all cards  | `q={text}` |
| `/cards/random` | get random card(s) | *optional* `n={integer <= 78}` |
