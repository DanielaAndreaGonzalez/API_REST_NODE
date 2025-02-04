const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
  },
  emailValidated: {
    type: Boolean,
    default: false,
  },

  resetPasswordToken : {
    type: String,
    default: "",
  },

  resetPasswordExpires : {
    type: Date,
  },

  password: {
    type: String,
    required: [true, 'Password is required']
  },

  estado: {
    type: Boolean,
    default: true,
  },
  
  role: {
    type: [String],
    default: ['USER_ROLE'],
    enum: ['ADMIN_ROLE', 'USER_ROLE']
  }
});

userSchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform: function (doc, ret, options) {
    delete ret._id;
    delete ret.password;
  },
});

const UserModel = mongoose.model('User', userSchema);

module.exports = UserModel;
