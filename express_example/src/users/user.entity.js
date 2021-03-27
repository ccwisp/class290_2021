const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const { roles } = require('../commons/util');

const Schema = mongoose.Schema;

const schema = new Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },

    password: {
      type: String,
      required: true,
    },

    firstName: {
      type: String,
      required: true,
    },

    lastName: {
      type: String,
      required: true,
    },

    loginAttemptCount: {
      type: Number,
      default: 0,
    },

    isLocked: {
      type: Boolean,
      default: false,
    },

    role: {
      type: String,
      enum: roles,
      default: roles[0],
    },
  },
  { collection: 'users' }
);

schema.pre('save', function (next) {
  if (this.isModified('password')) {
    const salt = bcrypt.genSaltSync();
    this.password = bcrypt.hashSync(this.password, salt);
  }
  //  Trim before saving
  if (this.isModified('firstName')) this.firstName = this.firstName.trim();
  if (this.isModified('lastName')) this.lastName = this.lastName.trim();

  next();
});

module.exports = mongoose.model('User', schema);
