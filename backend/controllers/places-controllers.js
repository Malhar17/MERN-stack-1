const fs = require("fs");
const { validationResult } = require("express-validator");
const { v4: uuid } = require("uuid");
const mongoose = require("mongoose");

const HttpError = require("../models/http-error");
const getCoordsForAddress = require("../utils/location");
const Place = require("../models/place");
const User = require("../models/user");

const getPlaceById = async (req, res, next) => {
  const placeId = req.params.pid;
  let place;
  try {
    place = await Place.findById(placeId);
  } catch (error) {
    return next(new HttpError("Something went wrong, could not find a place.", 500));
  }
  if (!place) {
    return next(new HttpError("Could not find a place for the provided id.", 404));
  }
  res.json({ place: place.toObject({ getters: true }) });
};

const getPlacesByUserId = async (req, res, next) => {
  const userId = req.params.uid;
  let user;
  try {
    user = await User.findById(userId).populate("places");
  } catch (error) {
    return next(new HttpError("Fetching places failed, please try again error", 500));
  }
  if (!user || user.places.length === 0) {
    return next(new HttpError("Could not find a places for the provided user id.", 404));
  }
  res.json({ places: user.places.map((p) => p.toObject({ getters: true })) });
};

const createPlace = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(new HttpError("Invalid inputs passed, please check your data.", 422));
  }
  const { title, description, address } = req.body;
  let coordinates;
  try {
    coordinates = await getCoordsForAddress(address);
  } catch (error) {
    return next(error);
  }
  const newPlace = new Place({
    title,
    description,
    address,
    location: coordinates,
    creator: req.userData.userId,
    image: req.file.path.replace(/\\/g, "/"),
  });

  let user;
  try {
    user = await User.findById(req.userData.userId);
  } catch (error) {
    return next(new HttpError("Creating place failed, please try again", 500));
  }
  if (!user) {
    return next(new HttpError("Could not find user for provided id", 404));
  }
  try {
    const session = await mongoose.startSession();
    session.startTransaction();
    await newPlace.save({ session });
    user.places.push(newPlace);
    await user.save({ session });
    await session.commitTransaction();
  } catch (error) {
    return next(new HttpError("Creating place failed, please try again", 500));
  }
  res.status(201).json(newPlace);
};

const updatePlace = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(new HttpError("Invalid inputs passed, please check your data.", 422));
  }
  const { title, description } = req.body;
  const placeId = req.params.pid;

  let place;
  try {
    place = await Place.findById(placeId);
  } catch (error) {
    return next(new HttpError("Something went wrong, could not update place.", 500));
  }

  if (place.creator.toString() !== req.userData.userId) {
    return next(new HttpError("You are not allowed to edit this place.", 401));
  }

  place.title = title;
  place.description = description;

  try {
    await place.save();
  } catch (error) {
    return next(new HttpError("Something went wrong, could not update place", 500));
  }

  res.status(200).json({ place: place.toObject({ getters: true }) });
};

const deletePlace = async (req, res, next) => {
  const placeId = req.params.pid;

  let place;
  try {
    place = await Place.findById(placeId);
  } catch (error) {
    return next(new HttpError("Something went wrong, could not update place.", 500));
  }

  if (place.creator.toString() !== req.userData.userId) {
    return next(new HttpError("You are not allowed to delete this place.", 401));
  }

  try {
    const session = await mongoose.startSession();
    session.startTransaction();
    place = await Place.findByIdAndDelete(placeId, { session }).populate("creator");
    place.creator.places.pull(place);
    await place.creator.save({ session });
    await session.commitTransaction();
  } catch (error) {
    return next(new HttpError("Something went wrong, could not delete place.", 500));
  }
  fs.unlink(place.image, (error) => {
    console.log(error);
  });
  res.status(200).json({ message: "Deleted Place" });
};

exports.getPlaceById = getPlaceById;
exports.getPlacesByUserId = getPlacesByUserId;
exports.createPlace = createPlace;
exports.updatePlace = updatePlace;
exports.deletePlace = deletePlace;
