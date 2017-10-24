const mongoose = require('mongoose');
const _ = require('lodash');
const moment = require('moment');

var PostSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    minlength: 1,
    trim: true
  },
  subtopic: {
    type: String,
    trim: true
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    minlength: 1,
    trim: true,
    ref: 'User'
  },
  description: {
    type: String,
    required: true
  },
  time: {
    type: String,
    required: true
  }
})


var Post = mongoose.model('Post', PostSchema)
// console.log(Team);
module.exports = {Post}
