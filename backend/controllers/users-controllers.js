const { v4: uuid } = require("uuid");
const { validationResult } = require("express-validator");
const HttpError = require("../models/http-error");
const User = require("../models/user");

const getUsers = async (req, res, next) => {
  let users;

  try {
    users = await User.find({}, "-password");
  } catch (error) {
    return next(new HttpError("Fetching users failed, please try again later.", 500));
  }

  if (!users) {
    return next(new HttpError("Fetching users failed, please try again later.", 422));
  }

  res.json({ users: users.map((u) => u.toObject({ getters: true })) });
};

const signup = async (req, res, next) => {
  console.log("signup");
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(new HttpError("Invalid inputs passed, please check your data.", 422));
  }

  const { name, email, password } = req.body;

  let existingUser;
  try {
    existingUser = await User.findOne({ email });
  } catch (error) {
    return next(new HttpError("Signing up failed, please try again", 500));
  }

  if (existingUser) {
    return next(new HttpError("Could not create user, email already exists", 422));
  }
  console.log(req.file.path);
  const newUser = new User({
    name,
    email,
    password,
    image: req.file.path.replace(/\\/g, "/"),
    places: [],
  });

  try {
    newUser.save();
  } catch (error) {
    return next(new HttpError("Signing up failed, please try again", 500));
  }

  res.status(201).json({ user: newUser.toObject({ getters: true }) });
};

const login = async (req, res, next) => {
  const { email, password } = req.body;
  let user;
  try {
    user = await User.findOne({ email });
  } catch (error) {
    return next(new HttpError("Logging in failed, please try again", 500));
  }

  if (!user || user.password !== password) {
    return next(new HttpError("Could not identify user, credentials seem to be wrong", 401));
  }
  res.json({ message: "Logged in", user: user.toObject({ getters: true }) });
};

exports.getUsers = getUsers;
exports.signup = signup;
exports.login = login;
