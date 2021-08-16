const Trip = require('../modews/Trip');

async function createTrip(tripData) {
    const trip = new Trip(tripData);

    await trip.save();

    return trip;
}

module.exports = {
    createTrip
}