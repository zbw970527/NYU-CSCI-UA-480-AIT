const express = require('express');
const mongoose = require('mongoose');

require('./db');
const session = require('express-session');
const path = require('path');
const auth = require('./auth.js');
const Article = mongoose.model('Article');
const User = mongoose.model('User');

const app = express();

app.set('view engine', 'hbs');

app.use(express.static(path.join(__dirname, 'public')));
app.set('views', path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: false }));
app.use(session({
    secret: 'add session secret here!',
    resave: false,
    saveUninitialized: true,
}));
app.use((req, res, next) => {
  // now you can use {{user}} in your template!
  res.locals.user = req.session.user;
  res.locals.regmessage = req.session.regerror;
  res.locals.logmessage = req.session.logerror;
  res.locals.addmessage = req.session.adderror;
  req.session.regerror = undefined;
  req.session.logerror = undefined;
  next();
});

app.get('/', (req, res) => {
  if(req.session.user !== undefined){
    Article.find({id: req.session.user.username}, (err, result) => {
      res.render('index', {'loggedin': true, 'article': result});
    });
  }
  else {
    res.render('index', {'loggedin': false});
  }
});

app.get('/article/add', (req, res) => {
  if(res.locals.user === undefined){
    res.redirect('/login');
  }
  else {
    res.render('article-add');
  }
});

app.post('/article/add', (req, res) => {
  if(res.locals.user === undefined){
    res.redirect('/login');
  }
  else {
    const article = new Article({
      title: req.body.title,
      url: req.body.url,
      description: req.body.description,
      id: req.session.user.username
    });
    article.save((err, result) => {
      if(err !== null){
        console.log(err);
        console.log(result);
        req.session.adderror = String(err);
        res.redirect('/login');
      }
      else {
        res.redirect('/');
      }
    });
  }
});


app.get(/^\/article\/.*/, (req, res) => {
  const slug = req.url.split('/article/')[1];
  Article.find({slug: slug}, (err, result) => {
    res.render('article-detail', {'article': result});
  });
});

app.get('/register', (req, res) => {
  res.render('register');
});

app.post('/register', (req, res) => {
  auth.register(req.body.username, req.body.email, req.body.password, (obj) =>{
    req.session.regerror = obj.message;
    res.redirect('/register');
  }, (user) =>{
    auth.startAuthenticatedSession(req, user, (obj = undefined) => {
      if(obj === undefined){
        res.redirect('/');
      }
      else {
        console.log(obj);
        req.session.regerror = 'startAuthenticatedSession Error!';
        res.redirect('/register');
      }
    });
  });
});


app.get('/login', (req, res) => {
  res.render('login');
});

app.post('/login', (req, res) => {
  auth.login(req.body.username, req.body.password, (obj) => {
    req.session.logerror = obj.message;
    res.redirect('/login');
  }, (user) => {
    auth.startAuthenticatedSession(req, user, (obj = undefined) => {
      if(obj === undefined){
        res.redirect('/');
      }
      else {
        console.log(obj);
        req.session.logerror = 'startAuthenticatedSession Error!';
        res.redirect('/login');
      }
    });
  });
});

app.get(/^.*/, (req, res) => {
  const user = req.url.split('/')[1];
  User.find({username: user}, (err, result) => {
    if(result.length === 0){
      res.render('user', {'found': false, 'un': user});
    }
    else {
      Article.find({id: user}, (err, result) => {
        res.render('user', {'found': true, 'un': user, 'article': result});
      });
    }
  });
});

app.listen(3000);
