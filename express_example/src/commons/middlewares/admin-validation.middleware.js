const createError = require('http-errors');

// Middleware for admin validation procedure
const adminValidateMiddleware = async (req, res, next) => {
  try {
    const { role } = req.user;
    console.log(req.body);

    if (role !== 'admin') {
      throw createError(403, 'Not authorized!');
    }
    return next();
  } catch (err) {
    return next(err);
  }
};

module.exports = adminValidateMiddleware;
