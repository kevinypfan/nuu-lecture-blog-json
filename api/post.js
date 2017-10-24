const express = require('express');
const _ = require('lodash');
var postRouter = express.Router();
const {Post} = require('../models/post.js');
const { authenticate } = require('../middleware/authenticate')

postRouter.route('/posts')
  .post(authenticate ,(req, res) => {
    var body = _.pick(req.body, ['title', 'subtopic',  'description', 'time'])
    body.author = req.user._id
    var post = new Post(body);
    post.save().then((post) => {
      res.send('貼文成功')
    }).catch((err) => {
      res.status(403).send(err)
    })
  })
  .delete(authenticate, (req, res) => {
    var postId = req.body._id;
    var userId = req.user._id;
    Post.findOne({'_id': postId})
    .then((post) => {
      if (!post) {
        return Promise.reject('沒有此貼文')
      } else if (post.author.toHexString() != userId) {
        return Promise.reject('您不是發文者')
      } else {
        return Post.findOneAndRemove({'_id': postId})
      }
    })
    .then((result) => {
      res.send('刪除成功')
    }).catch((err) => {
      res.status(403).send(err)
    })
  })
  .put(authenticate, (req, res) => {
    var postId = req.body._id;
    var userId = req.user._id;
    var body = _.pick(req.body, ['title', 'subtopic', 'description'])
    Post.findOne({'_id': postId})
    .then((post) => {
      if (!post) {
        return Promise.reject('沒有此貼文')
      } else if (post.author.toHexString() != userId) {
        return Promise.reject('您不是發文者')
      } else {
        return Post.findOneAndUpdate({'_id': postId}, {$set:{title: body.title, subtopic: body.subtopic, description: body.description}})
      }
    })
    .then((result) => {
      res.send('修改成功')
    }).catch((err) => {
      res.status(403).send(err)
    })
  })
  .get((req, res) => {
    Post.find().sort({_id: -1})
      .populate({
        path: 'author',
        select: ['name', 'email']
      })
      .then((result) => {
      res.send(result)
    })
  })

postRouter.get('/post/:id', authenticate, (req, res) => {
  var postId = req.params.id
  Post.findOne({_id: postId})
    .populate({
      path: 'author',
      select: ['name', 'email']
    })
    .then((post) => {
      if (!post) {
        return Promise.reject('找不到此貼文')
      }
      res.send(post)
    }).catch((err) => {
      res.status(403).send(err)
    })
})



module.exports = postRouter;
