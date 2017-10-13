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
    type: String,
    required: true,
    minlength: 1,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  time: {
    type: String,
    default: moment().valueOf()
  }
})


var Post = mongoose.model('Post', PostSchema)
// console.log(Team);
module.exports = {Post}
