const User = require('../users/user.entity');

const createError = require('http-errors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

class AuthService {
  async lock(user) {
    user.isLocked = !user.isLocked;
    await user.save();
  }

  async validate(username, password) {
    const user = await User.findOne({ username });
    if (!user) throw createError(401, 'Unauthorized');

    if (user.isLocked) {
      throw createError(423, 'The user is locked!');
    }
    if (!bcrypt.compareSync(password, user.password)) {
      if (user.loginAttemptCount === 2) {
        await this.lock(user);
        throw createError(423, 'The user is locked!');
      }
      user.loginAttemptCount += 1;
      await user.save();
      throw createError(401, 'Unauthorized');
    }

    return user;
  }

  async login(username, password) {
    const user = await this.validate(username, password);
    if (user.loginAttemptCount > 0) {
      user.loginAttemptCount = 0;
      await user.save();
    }

    const token = jwt.sign(
      { userId: user._id, username: user.username },
      process.env.JWT_SECRET,
      {
        expiresIn: process.env.JWT_EXPIRES_IN,
      }
    );

    return token;
  }

  validateToken(token) {
    const obj = jwt.verify(token, process.env.JWT_SECRET, {
      ignoreExpiration: false,
    });

    return { userId: obj.userId, username: obj.username };
  }
}

module.exports = new AuthService();
