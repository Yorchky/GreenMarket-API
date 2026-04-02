const jwt = require('jsonwebtoken');
const secret = process.env.JWT_TOKEN_SECRET;

const auth = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'No token provided' });
  }

  try {
    const decoded = jwt.verify(token, secret);
    req.user = decoded;
    next();
  } catch (error) {
    console.log("ERROR JWT:", error.message); // IMPORTANTE
    return res.status(401).json({ message: 'Invalid token' });
  }
};

module.exports = auth;