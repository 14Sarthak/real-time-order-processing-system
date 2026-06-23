const Driver = require("../models/Driver");
const env = require("../config/env");

const seedDrivers = [
  { driverCode: "DRV-101", name: "Rohit", vehicle: "Bike", coordinates: [77.5946, 12.9716] },
  { driverCode: "DRV-102", name: "Imran", vehicle: "Scooter", coordinates: [77.6001, 12.9762] },
  { driverCode: "DRV-103", name: "Neha", vehicle: "Bike", coordinates: [77.5871, 12.9667] },
  { driverCode: "DRV-104", name: "Vikram", vehicle: "EV", coordinates: [77.6034, 12.9689] },
  { driverCode: "DRV-105", name: "Sara", vehicle: "Bike", coordinates: [77.5912, 12.9811] },
];

const memoryDrivers = seedDrivers.map((driver) => ({
  ...driver,
  isAvailable: true,
}));

function isMongoEnabled() {
  return Boolean(env.mongoUri);
}

async function ensureSeedDrivers() {
  if (!isMongoEnabled()) return;

  const count = await Driver.countDocuments();
  if (count > 0) return;

  await Driver.insertMany(
    seedDrivers.map((driver) => ({
      driverCode: driver.driverCode,
      name: driver.name,
      vehicle: driver.vehicle,
      location: {
        type: "Point",
        coordinates: driver.coordinates,
      },
    })),
  );
}

function distanceKm(from, to) {
  const earthRadiusKm = 6371;
  const toRadians = (value) => (value * Math.PI) / 180;
  const latDistance = toRadians(to.lat - from.lat);
  const lngDistance = toRadians(to.lng - from.lng);
  const a =
    Math.sin(latDistance / 2) * Math.sin(latDistance / 2) +
    Math.cos(toRadians(from.lat)) *
      Math.cos(toRadians(to.lat)) *
      Math.sin(lngDistance / 2) *
      Math.sin(lngDistance / 2);
  return earthRadiusKm * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function findNearestMemoryDriver(location) {
  const nearest = memoryDrivers
    .filter((driver) => driver.isAvailable)
    .map((driver) => ({
      ...driver,
      distanceKm: distanceKm(
        { lat: driver.coordinates[1], lng: driver.coordinates[0] },
        location,
      ),
    }))
    .sort((a, b) => a.distanceKm - b.distanceKm)[0];

  if (!nearest) return null;

  nearest.isAvailable = false;

  return {
    id: nearest.driverCode,
    name: nearest.name,
    vehicle: nearest.vehicle,
    distanceKm: Number(nearest.distanceKm.toFixed(2)),
  };
}

async function findNearestDriver(location) {
  if (!isMongoEnabled()) {
    return findNearestMemoryDriver(location);
  }

  const [driver] = await Driver.aggregate([
    {
      $geoNear: {
        near: {
          type: "Point",
          coordinates: [location.lng, location.lat],
        },
        distanceField: "distanceMeters",
        spherical: true,
        query: { isAvailable: true },
        maxDistance: 5000,
      },
    },
    { $limit: 1 },
  ]);

  if (!driver) return null;

  await Driver.updateOne({ _id: driver._id }, { $set: { isAvailable: false } });

  return {
    id: driver.driverCode,
    name: driver.name,
    vehicle: driver.vehicle,
    distanceKm: Number((driver.distanceMeters / 1000).toFixed(2)),
  };
}

module.exports = {
  ensureSeedDrivers,
  findNearestDriver,
};
