const config = require("config");
const ENV = config.get("NODE_ENV");

const connectToDb = () => {
  if (ENV === "development") {
    require("./mongoDB/connectLocally");
  }
  if (ENV === "production") {
    require("./mongoDB/connectToAtlasDb");
  }
};

module.exports = connectToDb;
