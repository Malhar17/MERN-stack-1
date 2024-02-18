const axios = require("axios");
const HttpError = require("../models/http-error");

const API_KEY = process.env.API_KEY;

async function getCoordsForAddress(address) {
  //   return {
  //     lat: 40.7484405,
  //     lon: -73.9878584,
  //   };
  console.log("location", address);
  var config = {
    method: "get",
    url: `https://api.geoapify.com/v1/geocode/search?text=${address}&apiKey=${API_KEY}`,
    headers: {},
  };
  console.log(config);
  let response;
  try {
    response = await axios(config);
  } catch (error) {
    console.log("error: ", error);
    return {};
  }
  const data = response.data;
  console.log(data);
  if (!data || data.features.length === 0) {
    throw new HttpError(
      "Could not find location for the specified address.",
      422
    );
  }
  const coordinates = {
    lon: data.features[0].geometry.coordinates[0],
    lat: data.features[0].geometry.coordinates[1],
  };
  return coordinates;
}

module.exports = getCoordsForAddress;
