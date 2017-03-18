/* eslint no-console: 0 */

import express from 'express';
import webpack from 'webpack';
import webpackDevMiddleware from 'webpack-dev-middleware';
import webpackHotMiddleware from 'webpack-hot-middleware';

import config from './webpack.config.development';
import { dbusername, dbpassword } from './dbconfig';
import { MongoClient, ObjectID } from 'mongodb';

const bodyParser= require('body-parser');

const app = express();
const compiler = webpack(config);
const PORT = 8000;

const wdm = webpackDevMiddleware(compiler, {
  publicPath: config.output.publicPath,
  stats: {
    colors: true
  }
});

app.use(webpackHotMiddleware(compiler));
app.use(wdm);

MongoClient.connect(`mongodb://${dbusername}:${dbpassword}@ds149329.mlab.com:49329/sketches`, (err, db) => {
  if (err) return console.log(err)

  app.set('view engine', 'pug');

  app.use(bodyParser.urlencoded({extended: true}));
  app.use(bodyParser.json());

  app.get('/sketch/:id', function (req, res) {
    console.log(req.params.id)
    db.collection('sketches')
    .findOne({"_id": ObjectID(req.params.id)}, function (err, result) {
      res.render('index', { sketch: result.code });
    })
  });

  app.get('/sketch', function (req, res) {
    db.collection('sketches')
    .find({}).toArray(function (err, result) {
      res.send(result);
    })
  });

  app.post('/sketch', function (req, res) {
    db.collection('sketches').insert(req.body, (err, result) => {
      if (err) return console.log(err)
      res.send(result)
    })
  });

  app.delete('/sketch/:id', function (req, res) {
    db.collection('sketches').remove({_id: ObjectID(req.params.id)}, function (err, result) {
      if (err) return console.log(err)
      res.send(result);
    })
  });

  app.put('/sketch/:id', function (req, res) {
    db.collection('sketches').update({_id: ObjectID(req.params.id)}, req.body, (err, result) => {
      if (err) return console.log(err)
      res.send(result)
    })
  })
})

const server = app.listen(PORT, 'localhost', err => {
  if (err) {
    console.error(err);
    return;
  }

  console.log(`Listening at http://localhost:${PORT}`);
});

process.on('SIGTERM', () => {
  console.log('Stopping dev server');
  wdm.close();
  server.close(() => {
    process.exit(0);
  });
});
