const Trip = require('../modews/Trip');
const User = require('../modews/User');

async function createTrip(tripData, userId) {
    const trip = new Trip(tripData);
    const user = await User.findById(userId);

    user.trips.push(trip._id);

    await user.save();
    await trip.save();

    return trip;
}

async function getAllTrips() {
    const trips = await Trip.find().lean();
    return trips;
}

async function getOneTrip(id) {
    const trip = await Trip.findById(id).populate('buddies').lean();

    return trip;
}

async function joinTrip(userId, tripId) {
    const trip = await Trip.findById(tripId);

    trip.buddies.push(userId);

    trip.seats--;

    await trip.save();

    return trip;
}

async function deleteTrip(id) {
    return Trip.findByIdAndDelete(id);
}

async function editTrip(id, tripData) {
    const trip = await Trip.findById(id);

    trip.startPoint = tripData.startPoint
    trip.endPoint = tripData.endPoint
    trip.endPoint = tripData.endPoint
    trip.date = tripData.date
    trip.time = tripData.time
    trip.carImage = tripData.carImage
    trip.carBrand = tripData.carBrand
    trip.seats = Number(tripData.seats)
    trip.price = Number(tripData.price)
    trip.description = tripData.description

    await trip.save();

    return trip;
}

module.exports = {
    createTrip,
    getAllTrips,
    getOneTrip,
    joinTrip,
    deleteTrip,
    editTrip
}