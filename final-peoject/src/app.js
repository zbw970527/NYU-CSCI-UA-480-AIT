// Bowen Zhang
// bz896

const express = require('express');
require('./db.js');
const auth = require('./auth.js');
const session = require('express-session');
const mongoose = require('mongoose');
const URLSlugs = require('mongoose-url-slugs');

const User = mongoose.model('User');
const Review = mongoose.model('Review');
const Anime = mongoose.model('Anime');

const app = express();

app.set('view engine', 'hbs');
app.use(express.urlencoded({extended: false}));
app.use(express.static('public'));

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
  req.session.adderror = undefined;
  next();
});

app.get('/', (req, res) => {
  Anime.find({}, (err, result)=>{
    result = result.sort(function(a, b){
      return a.releaseYear == b.releaseYear ? 0 : +(a.releaseYear > b.releaseYear) || -1;
    }).reverse();
    res.render('index', {'animeList': result});
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
        res.redirect('/myhomepage');
      }
      else {
        console.log(obj);
        req.session.logerror = 'startAuthenticatedSession Error!';
        res.redirect('/login');
      }
    });
  });
});

app.get('/register', (req, res) => {
  res.render('register');
});

app.post('/register', (req, res) => {
  auth.register(req.body.username, req.body.password, (obj) =>{
    req.session.regerror = obj.message;
    res.redirect('/register');
  }, (user) =>{
    auth.startAuthenticatedSession(req, user, (obj = undefined) => {
      if(obj === undefined){
        res.redirect('/myhomepage');
      }
      else {
        console.log(obj);
        req.session.regerror = 'startAuthenticatedSession Error!';
        res.redirect('/register');
      }
    });
  });
});

app.get('/myhomepage/addForum', (req, res) => {
  if(res.locals.user === undefined){
    res.redirect('/login');
  }
  else{
    res.render('addAnimeForum');
  }
});

app.post('/myhomepage/addForum', (req, res)=>{
  if(res.locals.user === undefined){
    res.redirect('/login');
  }
  else{
    Anime.find({animeName: req.body.animeName}, (err, result)=>{
      if (result.length > 0) {
        req.session.adderror = "The forum for this anime is already created!!";
        res.redirect('/myhomepage/addForum');
      }
      else {
        const anime = new Anime({
          animeName: req.body.animeName,
          animeNameJp: req.body.animeNameJp,
          releaseYear: req.body.releaseYear,
          description: req.body.description
        });
        anime.save((err, result) => {
          if(err !== null){
            console.log(err);
            console.log(result);
            req.session.adderror = String(err);
            res.redirect('/myhomepage');
          }
          else {
            res.redirect('/');
          }
        });
      }
    });
  }
});

app.get(/^\/forum\/.*\/addReview$/, (req, res) => {
  if(res.locals.user === undefined){
    res.redirect('/login');
  }
  else{
    res.render('addReview');
  }
});

app.post(/^\/forum\/.*\/addReview$/, (req, res) => {
  const review = new Review({
    animeName: req.body.animeName,
    title: req.body.title,
    content: req.body.review,
    reviewer: req.session.user.username,
    rating: req.body.rating,
    date: Date()
  });
  review.save((err, result) => {
    if(err !== null){
      console.log(err);
      console.log(result);
      req.session.adderror = String(err);
      res.redirect(req.url.slice(0, -11));
    }
    else {
      res.redirect(req.url.slice(0, -11));
    }
  });
});


app.get(/^\/forum\/.*/, (req, res) => {
   const slug = req.url.split('/forum/')[1];
   let name = undefined;
   Anime.find({slug: slug}, (err, result) => {
    if(result.length > 0){
      name = result[0]["animeName"];
      let rates = [];
      Review.find({animeName: name}, (err, result) =>{
        for (var i = 0; i < result.length; i++) {
          rates.push(result[i]["rating"]);
        }
        let score = undefined;
        if(rates.length > 0){
          const addReducer = (accumulator, currentValue) => accumulator + currentValue;
          score = (rates.reduce(addReducer)/rates.length).toFixed(2);
        }else {
          score = "No rating yet!!";
        }
        result = result.sort(function(a, b){
          return a.date == b.date ? 0 : +(a.date > b.date) || -1;
        }).reverse();
        res.render('forum', {'animeName': name, 'rating': score, 'list':result, 'slug': slug});
      });
    }
    else {
      res.redirect('/');
    }
  });
});

app.get('/myhomepage', (req, res) => {
  if(res.locals.user === undefined){

    res.redirect('/login');
  }
  else{
    User.find({username: req.session.user.username}, (err, result)=>{
      const animeList = result[0]['list'];
      let anime = [];
      for (var i = 0; i < animeList.length; i++) {
        Anime.find({animeName: animeList[i]}, (err, result)=>{
          anime.push({'animeName': result[0]['animeName'], 'slug': result[0]['slug']});
        });
      }
      Review.find({reviewer: req.session.user.username}, (err, result) =>{
        result = result.sort(function(a, b){
          return a.date == b.date ? 0 : +(a.date > b.date) || -1;
        }).reverse();
        res.render('homepage', {'anime': anime, 'list': result});
      });
    });
  }
});

app.get('/myhomepage/addAnime', (req, res) => {
  if(res.locals.user === undefined){
    res.redirect('/login');
  }
  else{
    res.render('addAnime');
  }
});

app.post('/myhomepage/addAnime', (req, res) => {
  if(res.locals.user === undefined){
    res.redirect('/login');
  }
  else {
    User.find( { username:req.session.user.username, list: { $in : [req.body.animeName]} }, (err, result)=>{
      if (result.length > 0) {
        req.session.adderror = "Already exist in your list!";
        res.redirect('/myhomepage/addAnime');
      }
      else {
        const animeName = req.body.animeName;
        Anime.find({animeName: animeName}, (err, result)=>{
          if(result.length > 0){
            User.findOneAndUpdate({'username': req.session.user.username}, {$push: {'list': animeName}}, function (error, success) {
              if (error) {
                  console.log(error);
              } else {
                  console.log(success);
              }
            });
            res.redirect('/myhomepage');
          }
          else {
            req.session.adderror = "No such forum! Please check the name or create it by yourself!";
            res.redirect('/myhomepage/addAnime');
          }
        });
      }
    });
  }
});

app.get(/^\/article\/.*/, (req, res) => {
  const slug = req.url.split('/article/')[1];
  Review.find({slug: slug}, (err, result) => {
    res.render('article', {'article': result});
  });
});

app.listen(process.env.PORT || 3000);
