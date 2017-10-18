const express = require('express');
const _ = require('lodash');
var userRouter = express.Router();
const {User} = require('../models/user.js');
const { authenticate } = require('../middleware/authenticate')

userRouter.post('/signup',(req, res) => {
  var body = _.pick(req.body, ['email', 'password', 'name'])
  var user = new User(body);
  user.save().then(() => {
    return user.generateAuthToken()
  }).then((token) => {
    res.header('token', token).send('成功註冊');
  }).catch((e) => {
    if (e.code == '11000') {
      res.status(400).send('Email已經使用過了');
    }
    res.status(400).send(e);
  })
});

userRouter.post('/signin', (req, res) => {
  var body = _.pick(req.body, ['email', 'password']);
  User.findByCredentials(body.email, body.password).then((user) => {
    return user.generateAuthToken()
  }).then((token) => {
    res.header('token', token).send('登入成功');
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
