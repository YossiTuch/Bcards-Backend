const chalk = require("chalk");
const morgan = require("morgan");
const currentDateTimeStr = require("../../utils/dateTimeStr");

const morganLogger = morgan((tokens, req, res) => {
  const status = Number(tokens.status(req, res));
  const logMessage = [
    currentDateTimeStr,
    tokens.method(req, res),
    tokens.url(req, res),
    status,
    "-",
    tokens["response-time"](req, res),
    "ms",
  ].join(" ");

  return (status >= 400 ? chalk.redBright : chalk.cyanBright)(logMessage);
});

module.exports = morganLogger;
