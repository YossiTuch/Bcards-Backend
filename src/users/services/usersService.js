const {
  createUser,
  login,
  findUsers,
  findUser,
  update,
  changeUserBusinessStatus,
  removeUser,
} = require("../models/usersAccessDataService");
const {
  validateRegistration,
  validateLogin,
  validateUserUpdate,
} = require("../validations/userValidationService");
const normalizeUser = require("../helpers/normalizeUser");
const { generateUserPassword } = require("../helpers/bcrypt");

const getUsers = async () => {
  try {
    const users = await findUsers();
    return Promise.resolve(users);
  } catch (error) {
    return Promise.reject(error);
  }
};

const getUser = async (userId) => {
  try {
    const user = await findUser(userId);
    return Promise.resolve(user);
  } catch (error) {
    return Promise.reject(error);
  }
};

const registerUser = async (rawUser) => {
  try {
    const { error } = validateRegistration(rawUser);
    if (error) {
      return Promise.reject(error);
    }

    let user = normalizeUser(rawUser);
    user.password = generateUserPassword(user.password);
    user = await createUser(user);

    return Promise.resolve(user);
  } catch (error) {
    return Promise.reject(error);
  }
};

const loginUser = async (rawUser) => {
  try {
    const { error } = validateLogin(rawUser);
    if (error) {
      return Promise.reject(error);
    }
    let user = { ...rawUser };
    user = await login(user);

    return Promise.resolve(user);
  } catch (error) {
    return Promise.reject(error);
  }
};

const updateUser = async (userId, rawUser) => {
  try {
    const { error } = validateUserUpdate(rawUser);
    if (error) {
      return Promise.reject(error);
    }
    let normalizedUser = normalizeUser(rawUser);
    const user = await update(userId, normalizedUser);
    return Promise.resolve(user);
  } catch (error) {
    return Promise.reject(error);
  }
};

const deleteUser = async (userId) => {
  try {
    const user = await removeUser(userId);
    return Promise.resolve(user);
  } catch (error) {
    return Promise.reject(error);
  }
};

const toggleBusinessStatus = async (userId) => {
  try {
    const user = await changeUserBusinessStatus(userId);
    return Promise.resolve(user);
  } catch (error) {
    return Promise.reject(error);
  }
};

module.exports = {
  getUsers,
  getUser,
  registerUser,
  updateUser,
  deleteUser,
  loginUser,
  toggleBusinessStatus,
};
