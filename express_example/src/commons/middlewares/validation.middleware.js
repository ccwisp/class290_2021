const createError = require('http-errors');
const User = require('../../users/user.entity');

// Middleware for standard validation procedure
const validateMiddleware = async (req, res, next) => {
  try {
    const { password, username } = req.body;
    // const reg_email = /\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*/;

    if (!(password && username)) {
      throw createError(400, 'Fields are not given');
    }

    if (username && !(username.length >= 4)) {
      throw createError(400, 'invalid username length (must be >= 4)');
    }

    const user = await User.findOne({ username });
    if (user) throw createError(409, 'username is already taken');

    return next();
  } catch (err) {
    return next(err);
  }
};

module.exports = validateMiddleware;
