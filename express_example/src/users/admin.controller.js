const express = require('express');
const router = express.Router();
const admins = require('./admin.service');
const asyncHandler = require('express-async-handler');
const validation = require('../commons/middlewares/admin-validation.middleware');

router.use(function timeLog(req, res, next) {
  console.log('Time: ', new Date());
  next();
});

router.patch(
  '/unlock-user/:id',
  validation,
  asyncHandler(async (req, res) => {
    const { id } = req.params;
    await admins.unlock(id);
    res.status(200).json({ message: 'User has successfully been unlocked!' });
  })
);
router.patch(
  '/lock-user/:id',
  validation,
  asyncHandler(async (req, res) => {
    const { id } = req.params;
    await admins.lock(id);
    res.status(200).json({ message: 'User has successfully been locked!' });
  })
);

module.exports = router;
