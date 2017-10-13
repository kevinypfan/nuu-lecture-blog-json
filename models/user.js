const mongoose = require('mongoose');
const validator = require('validator');
const isEmail = require('validator/lib/isEmail')
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken')
const _ = require('lodash');

var UserSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    trim: true,
    minlength: 1,
    unique: true,
    validate: {
      validator: (value)=>{validator.isEmail(value)},
      message: '{VALUE} 不是合法的信箱'
    }
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  name: {
    type: String,
    required: true,
    minlength: 1
  },
  tokens: [{
    token: {
      type: String,
      required: true
    }
  }]
})

UserSchema.methods.generateAuthToken = function () {
  var user = this;
  var token = jwt.sign({_id: user._id.toHexString()}, process.env.JWT_SECRET).toString();
  user.tokens.push({token});
  return user.save().then(() => {
    return token
  })
}

UserSchema.statics.findByCredentials = function (email, password) {
  var User = this;

  return User.findOne({email}).then((user) => {
    if (!user) {
      return Promise.reject("沒有這個會員");
    }
    return new Promise((resolve, reject) => {
      bcrypt.compare(password, user.password).then((res) => {
         if (res) {
           resolve(user);
         } else {
           reject("此密碼錯誤");
         }
       })
    })
  })
}

UserSchema.statics.findByToken = function (token) {
  var User = this;
  var decoded;
  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET)
  } catch (e) {
    return Promise.reject();
  }
  return User.findOne({
    _id: decoded._id,
    'tokens.token': token
  })
}

UserSchema.methods.toJson = function () {
  var user = this;
  var userObject = user.toObject();
  return _.pick(userObject, ['_id', 'email','name'])
}

UserSchema.methods.removeToken = function (token) {
  var user = this;

  return user.update({
    $pull: {
      tokens: {token}
    }
  })
}

UserSchema.pre('save', function (next) {
  var user = this;
  if (user.isModified('password')){
    bcrypt.hash(user.password, 10).then(hash => {
      user.password = hash;
      next();
    })
  } else {
    next();
  }
})

var User = mongoose.model('User', UserSchema);

module.exports = {User}
