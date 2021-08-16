const User = require('../modews/User');


async function createUser(email, hashedPassword, gender) {
    const user = new User({
        email,
        hashedPassword,
        gender,
        trips: []

    });

    user.save();
    return user;
}

async function getUserByEmail(email) {
    const pattern = new RegExp(`^${email}$`, 'i');
    const user = await User.findOne({ email: { $regex: pattern } });
    return user;
}

module.exports = {
    createUser,
    getUserByEmail
}