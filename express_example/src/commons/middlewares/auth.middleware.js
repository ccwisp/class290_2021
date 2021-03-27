const createError = require('http-errors');
const { validateToken } = require('../../auth/auth.service');
const users = require('../../users/users.service');

const jwtMiddleware = async (req, res, next) => {
  let token;
  try {
    token = req.header('Authorization').split(' ')[1];
    const user = validateToken(token);
    const dbUser = await users.findOne(user.userId);
    user.role = dbUser.role;
    req.user = user;
    if (user.isLocked) throw createError(423, 'The user is locked!');
  } catch (err) {
    return next(err);
  }

  next();
};

jwtMiddleware.unless = require('express-unless');

module.exports = {
  jwtMiddleware,
};
