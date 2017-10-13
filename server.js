require('./config/config.js')

const express = require('express');
const mongoose = require('mongoose');
const lodash = require('lodash');
const bodyParser = require('body-parser');

const userRouter = require('./api/user')
const postRouter = require('./api/post')

var app = express();

mongoose.Promise = global.Promise;
mongoose.connect(`mongodb://localhost:27017/${process.env.MONGODB_URL}`, { useMongoClient: true });

app.use(bodyParser.json());

app.all('/*', function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,PATCH,OPTIONS');
  res.header('Access-Control-Allow-Credentials', true);
  // res.header('Access-Control-Expose-Headers', 'token');
  next();
});

app.use('/api/user', userRouter)
app.use('/api', postRouter)

app.get('/json/products', (req, res) => {
  res.send(require('./products.json'))
})

app.listen(process.env.PORT, () => {
  console.log(`server start up port ${process.env.PORT}`);
})
