const isChildTermOf = require("./ischildtermof");
const isValidTaxonomy = require("./isvalidtaxonomy");
const isValidTerm = require("./isvalidterm");
const IsIntersected = require("./IsIntersected");

module.exports = {
  isChildTermOf: isChildTermOf,
  isValidTaxonomy: isValidTaxonomy,
  isValidTerm: isValidTerm,
  isIntersected: IsIntersected
};
