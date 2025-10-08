function getNearbyCook(target, users, radiusInMeters) {
  const toRadians = (deg) => (deg * Math.PI) / 180;
  const EARTH_RADIUS_KM = 6371;

  const haversine = (loc1, loc2) => {
    const dLat = toRadians(loc2.lat - loc1.lat);
    const dLon = toRadians(loc2.lon - loc1.lon);

    const lat1Rad = toRadians(loc1.lat);
    const lat2Rad = toRadians(loc2.lat);

    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos(lat1Rad) * Math.cos(lat2Rad) * Math.sin(dLon / 2) ** 2;

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return EARTH_RADIUS_KM * c * 1000; // return meters
  };

  return users.filter((user) => {
    if (typeof user.location.coordinates.lat !== "number" || typeof user.location.coordinates.lon !== "number") return false;
    const distanceMeters = haversine(target, { lat: user.location.coordinates.lat, lon: user.location.coordinates.lon });
    return distanceMeters <= radiusInMeters;
  });
}

module.exports = getNearbyCook;
