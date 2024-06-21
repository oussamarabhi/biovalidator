const axios = require("axios");
const ajv = require("ajv").default;
const CustomAjvError = require("../model/custom-ajv-error");
const { logger } = require("../utils/winston");

class IsIntersected {
  constructor(keywordName, apiUrl) {
    this.keywordName = keywordName ? keywordName : "isIntersected";
    this.apiUrl = apiUrl;
  }

  configure(ajv) {
    const keywordDefinition = {
      keyword: this.keywordName,
      async: IsIntersected._isAsync(),
      type: "object",
      validate: this.generateKeywordFunction(),
      errors: true
    };

    return ajv.addKeyword(keywordDefinition);
  }

  static _isAsync() {
    return true;
  }

  generateKeywordFunction() {
    const generateErrorObject = (message) => {
      return new CustomAjvError("isIntersected", message, {});
    };

    return (schema, data) => {
      return new Promise((resolve, reject) => {
        if (schema) {
          let errors = [];
          const { proteinId, start, end } = data;
          const url = `${this.apiUrl}?proteinId=${proteinId}&start=${start}&end=${end}`;
          axios({ method: "GET", url: url, responseType: "json" })
            .then((response) => {
              if (response.status === 200) {
                const result = response.data;
                if (result.status === 200) {
                  const message = `Protein intersects with ${result.intersectingProtein}`;
                  logger.debug(message);
                  console.warn(message);
                  errors.push(
                    new CustomAjvError("isIntersected", message, {
                      keyword: "isIntersected"
                    })
                  );
                  reject(new ajv.ValidationError(errors));
                } else {
                  resolve(true);
                }
              } else {
                logger.error("API call failed: " + response.statusText);
                reject(
                  generateErrorObject(
                    "Failed to validate intersection: " + response.statusText
                  )
                );
              }
            })
            .catch((err) => {
              logger.error("API call failed: " + err);
              reject(
                generateErrorObject(
                  "Failed to validate intersection: " + err.message
                )
              );
            });
        } else {
          const message =
            "Missing required properties: proteinId, start, and end.";
          logger.error(message);
          reject(generateErrorObject(message));
        }
      });
    };
  }
}

module.exports = IsIntersected;
