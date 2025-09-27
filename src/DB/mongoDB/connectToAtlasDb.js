const mongoose = require("mongoose");
const chalk = require("chalk");
require("dotenv").config();

const mongodbURI = process.env.MONGODB_URI;

mongoose
  .connect(mongodbURI)
  .then(() => console.log(chalk.magentaBright("Connect To Atlas MongoDB!")))
  .catch(error => {
    console.log(chalk.redBright(error));
  });
