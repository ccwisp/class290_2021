const users = require('./users.service');

class AdminService {
  async lock(id) {
    const user = await users.findOne(id);
    if (user.isLocked) return;
    user.isLocked = true;
    await user.save();
  }

  async unlock(id) {
    const user = await users.findOne(id);
    if (!user.isLocked) return;
    user.isLocked = false;
    await user.save();
  }
}

module.exports = new AdminService();
