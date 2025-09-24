const mongoose = require("mongoose");
const chalk = require("chalk");
require("dotenv").config();

const mongoConnection = process.env.MONGO_CONNECTION;

mongoose
  .connect(mongoConnection)
  .then(() => console.log(chalk.magentaBright("Connect To Atlas MongoDB!")))
  .catch(error => {
    console.log(chalk.redBright(error));
  });
