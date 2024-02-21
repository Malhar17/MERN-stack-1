const { v4: uuid } = require("uuid");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
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

  let hashedPassword;

  try {
    hashedPassword = await bcrypt.hash(password, 12);
  } catch (error) {
    return next(new HttpError("Could not create user, please try again", 500));
  }

  const newUser = new User({
    name,
    email,
    password: hashedPassword,
    image: req.file.path.replace(/\\/g, "/"),
    places: [],
  });

  try {
    newUser.save();
  } catch (error) {
    return next(new HttpError("Signing up failed, please try again", 500));
  }

  let token;

  try {
    token = jwt.sign({ userId: newUser.id, email: newUser.email }, process.env.TOKEN_PRIVATE_KEY, {
      expiresIn: "1h",
    });
  } catch (error) {
    return next(new HttpError("Signing up failed, please try again", 500));
  }

  res.status(201).json({ userId: newUser.id, email: newUser.email, token: token });
};

const login = async (req, res, next) => {
  const { email, password } = req.body;
  let user;
  try {
    user = await User.findOne({ email });
  } catch (error) {
    return next(new HttpError("Logging in failed, please try again", 500));
  }
  if (!user) {
    return next(new HttpError("Logging in failed, please try again", 401));
  }
  let isValidPassword;
  try {
    isValidPassword = await bcrypt.compare(password, user.password);
  } catch (error) {
    return next(new HttpError("Could not identify user, credentials seem to be wrong", 500));
  }

  if (!isValidPassword) {
    return next(new HttpError("Could not identify user, credentials seem to be wrong", 500));
  }

  let token;

  try {
    token = jwt.sign({ userId: user.id, email: user.email }, process.env.TOKEN_PRIVATE_KEY, {
      expiresIn: "1h",
    });
  } catch (error) {
    return next(new HttpError("Logging in failed, please try again", 500));
  }

  res.json({ userId: user.id, email: user.email, token: token });
};

exports.getUsers = getUsers;
exports.signup = signup;
exports.login = login;
