const express = require('express');
const _ = require('lodash');
var userRouter = express.Router();
const {User} = require('../models/user.js');
const { authenticate } = require('../middleware/authenticate')

userRouter.post('/signup',(req, res) => {
  var body = _.pick(req.body, ['email', 'password', 'name'])
  var user = new User(body);
  user.save().then(() => {
    return Promise.all([user.generateAuthToken(), user.toJson()])
  }).then(([token, user]) => {
    res.header('token', token).send(user);
  }).catch((e) => {
    if (e.code == '11000') {
      res.status(400).send('Email已經使用過了');
    }
    res.status(400).send(e);
  })
});

userRouter.get('/uniqueEmail/:email', (req, res) => {
  var email = req.params.email;
  var regex = new RegExp("^[a-zA-Z0-9!#$&_*?^{}~-]+(\.[a-zA-Z0-9!#$&_*?^{}~-]+)*@([a-z0-9]+([a-z0-9-]*)\.)+[a-zA-Z]+$", "g");
  if (!regex.test(email)) {
    res.status(402).send("此信箱不合規範")
  } else {
    User.findOne({ email }).then((response) => {
      if (!response) {
        res.status(200).send()
        return;
      }
      return Promise.reject('此信箱已有人使用了')
    }).catch((err) => {
      res.status(402).send(err)
    })
  }
})

userRouter.post('/signin', (req, res) => {
  var body = _.pick(req.body, ['email', 'password']);
  User.findByCredentials(body.email, body.password).then((user) => {
    return Promise.all([user.generateAuthToken(), user.toJson()])
  }).then(([token, user]) => {
    res.header('token', token).send(user);
  }).catch((e) => {
    res.status(403).send(e);
  })
})

userRouter.get('/check', authenticate, (req, res) => {
  var user = req.user
  var objUser = user.toJson()
  res.send(objUser);
})

userRouter.delete('/logout', authenticate, (req, res) => {
  req.user.removeToken(req.token).then(()=>{
    res.status(200).send('成功登出');
  }).catch(() => {
    res.status(400).send();
  })
})

module.exports = userRouter;
