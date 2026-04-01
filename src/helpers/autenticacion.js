//Helper
const jwt = require('jsonwebtoken');

// Function to generate JWT
const generarToken = (email, password) => {

    const payload = {
        email: email,
        password: password
    };

    return jwt.sign(
        payload,
        process.env.JWT_TOKEN_SECRET,
        { expiresIn: '1h' }
    );
};

module.exports = {
    generarToken
};