const express = require('express');
const session = require('express-session');
require('./db.js');

const app = express();
const mongoose = require('mongoose');
const Sound = mongoose.model('Sound');

app.set('view engine', 'hbs');
app.use(express.urlencoded({extended: false}));
app.use(express.static('public'));

app.use(session({
  name: "service count",
  secret: "make it secret!",
  saveUninitialized: true,
  resave: false
}));

app.use((req, res, next)=>{
  res.locals.session = req.session;
  if(res.locals.session.count === undefined){
    res.locals.session.count = 0;
  }
  console.log(req.session.id);
  next();
});

app.get('/', (req, res) => {
  res.locals.session.count++;
  const query = {};
  if(req.query.what !== undefined && req.query.what !== ''){
    query['what'] = req.query.what;
  }
  if(req.query.where !== undefined && req.query.where !== ''){
    query['where'] = req.query.where;
  }
  if(req.query.date !== undefined && req.query.date !== ''){
    query['date'] = req.query.date;
  }
  if(req.query.hour !== undefined && req.query.hour !== ''){
    query['hour'] = req.query.hour;
  }
  Sound.find(query, (err, result) => {
    res.render('main', {'sounds': result, 'count' : res.locals.session.count});
  });
});

app.get('/sounds/add', (req, res) => {
  res.locals.session.count ++;
  res.render('add', {'count': res.locals.session.count});
});

app.post('/sounds/add', (req, res) => {
  const s = new Sound({
    what: req.body['what'],
    where: req.body['where'],
    date: req.body['date'],
    hour: req.body['hour'],
    desc: req.body['desc'],
    s_id: res.locals.session.id
  });
  s.save((err, result)=>{
    if(err !== null){
      console.log(err, result);
    }
  });
  res.redirect('/');
});

app.get('/sounds/mine', (req, res)=>{
  res.locals.session.cont ++;
  Sound.find({'s_id': res.locals.session.id}, (err, result) => {
    res.render('mine', {'sounds': result, 'count' : res.locals.session.count});
  });
});

app.listen(3000);
