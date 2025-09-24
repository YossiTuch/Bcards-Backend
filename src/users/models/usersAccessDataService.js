const DB = process.env.DB || "MONGODB";
const User = require("./mongodb/User");
const lodash = require("lodash");
const { handleBadRequest } = require("../../utils/errorHandler");
const { comparePassword } = require("../helpers/bcrypt");
const { generateAuthToken } = require("../../auth/Providers/jwt");

const createUser = async normalizedUser => {
  if (DB === "MONGODB") {
    try {
      const { email } = normalizedUser;
      let user = await User.findOne({ email });
      if (user) throw new Error("User already registered");

      user = new User(normalizedUser);
      user = await user.save();

      user = lodash.pick(user, ["name", "email", "_id"]);
      return Promise.resolve(user);
    } catch (error) {
      error.status = 400;
      return Promise.reject(error);
    }
  }
  return Promise.resolve("registerUser new user not in mongodb");
};

const login = async ({ email, password }) => {
  if (DB === "MONGODB") {
    try {
      const user = await User.findOne({ email });
      if (!user)
        throw new Error("Authentication Error: Invalid email or password");

      const validPassword = comparePassword(password, user.password);
      if (!validPassword)
        throw new Error("Authentication Error: Invalid email or password");

      const token = generateAuthToken(user);
      return Promise.resolve(token);
    } catch (error) {
      error.status = 400;
      return Promise.reject(error);
    }
  }
  return Promise.resolve("loginUser user not in mongodb");
};

const findUsers = async () => {
  if (DB === "MONGODB") {
    try {
      const users = await User.find({}, { password: 0, __v: 0 });
      return Promise.resolve(users);
    } catch (error) {
      error.status = 404;
      return Promise.reject(error);
    }
  }
  return Promise.resolve("get users not in mongodb");
};

const findUser = async userId => {
  if (DB === "MONGODB") {
    try {
      let user = await User.findById(userId, {
        password: 0,
        __v: 0,
      });
      if (!user) throw new Error("Could not find this user in the database");
      return Promise.resolve(user);
    } catch (error) {
      error.status = 404;
      return handleBadRequest("Mongoose", error);
    }
  }
  return Promise.resolve("get user not in mongodb");
};

const update = async (userId, normalizedUser) => {
  if (DB === "MONGODB") {
    try {
      const user = await User.findByIdAndUpdate(userId, normalizedUser, {
        new: true,
        runValidators: true,
      }).select("-password -__v");
      if (!user) {
        const error = new Error("User not found");
        error.status = 404;
        throw error;
      }

      await user.save();
      return Promise.resolve(
        lodash.pick(user, [
          "_id",
          "name",
          "email",
          "phone",
          "image",
          "address",
          "isBusiness",
          "createdAt",
        ])
      );
    } catch (error) {
      error.status = 400;
      return Promise.reject(error);
    }
  }
  return Promise.resolve("user update not in mongodb");
};

const changeUserBusinessStatus = async userId => {
  if (DB === "MONGODB") {
    try {
      const user = await User.findById(userId);
      if (!user) {
        const error = new Error("User not found");
        error.status = 404;
        throw error;
      }

      user.isBusiness = !user.isBusiness;
      await user.save();

      return Promise.resolve(
        lodash.pick(user, [
          "_id",
          "name",
          "email",
          "phone",
          "image",
          "address",
          "isBusiness",
          "createdAt",
        ])
      );
    } catch (error) {
      error.status = error.status || 400;
      return Promise.reject(error);
    }
  }
  return Promise.resolve("card liked not in mongodb");
};

const removeUser = async userId => {
  if (DB === "MONGODB") {
    try {
      const user = User.findByIdAndDelete(userId, { password: 0, __v: 0 });
      return Promise.resolve(user);
    } catch (error) {
      error.status = 400;
      return Promise.reject(error);
    }
  }
  return Promise.resolve("card deleted not in mongodb");
};

exports.createUser = createUser;
exports.login = login;
exports.findUsers = findUsers;
exports.findUser = findUser;
exports.update = update;
exports.changeUserBusinessStatus = changeUserBusinessStatus;
exports.removeUser = removeUser;
