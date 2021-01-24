var path = require("path");
var assert = require("assert");

const red = (msg) => "\x1b[31m" + msg + "\x1b[0m";
const green = (msg) => "\x1b[32m" + msg + "\x1b[0m";
const bold = (msg) => "\x1b[1m" + msg + "\x1b[0m";

const validate = (cards = null) => {
  let nValid = 0;
  let nInvalid = 0;
  try {
    assert(!!cards, 'Arg "cards" is falsy');
    assert(Array.isArray(cards), 'Arg "cards" is not an array');
    assert(cards.length === 78, 'Array "cards" does not have length of 78');
  } catch (assertionError) {
    console.error(red(assertionError.message));
  }

  cards.forEach((c, i) => {
    process.stdout.write(`${bold(c.name || "card[" + i + "]")}: `);
    try {
      assert(typeof c === "object", `Arg is not of type "object"`);
      assert(c.name && c.name.length, `Bad attr "name"`);
      assert(
        c.name_short && c.name_short.length === 4,
        `Bad attr "name_short"`
      );
      assert(c.desc && c.desc.length, `Bad attr "desc"`);
      assert(!Number.isNaN(parseInt(c.value_int, 10)), `Bad attr "value_int"`);
      assert(c.value && c.value.length, `Bad attr "value"`);
      assert(c.meaning_up && c.meaning_up.length, `Bad attr "meaning_up"`);
      assert(
        (c.meaning_rev && c.meaning_rev.length) || c.name_short === "cu02",
        `Bad attr "meaning_rev"`
      );
      assert(
        ["major", "minor"].includes(c.type),
        `Bad attr "type" (must be in ["major", "minor"]`
      );
      c.type === "minor" &&
        assert(
          ["cups", "wands", "swords", "pentacles"].includes(c.suit),
          `Bad attr "suit" (must be in ["cups", "wands", "swords", "pentacles"]`
        );
      nValid += 1;
      console.log(green("OK"));
    } catch (assertionError) {
      nInvalid += 1;
      console.log(red(assertionError.message));
    }
  });
  console.log(`
    \tValid card count: ${green(nValid)}
    \tInvalid card count: ${red(nInvalid)}`);
  process.exit(0);
};

const getCards = () => {
  try {
    const { cards } = require(path.join(
      __dirname,
      "../",
      "static",
      "card_data.json"
    ));
    return cards;
  } catch (error) {
    console.log(red(`Error: ${error.message}`));
    process.exit(1);
  }
};

validate(getCards());
