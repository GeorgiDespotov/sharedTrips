const { Schema, model } = require('mongoose');

const schema = new Schema({
    startPoint: { type: String },
    endPoint: { type: String },
    date: { type: String },
    time: { type: String },
    carImage: { type: String },
    carBrand: { type: String },
    seats: { type: Number },
    price: { type: Number },
    description: { type: String },
    creator: { type: Schema.Types.ObjectId, ref: 'User' },
    buddies: [{ type: Schema.Types.ObjectId, ref: 'User' }]
});

module.exports = model('Trip', schema);