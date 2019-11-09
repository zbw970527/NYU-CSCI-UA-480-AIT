const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');

const User = mongoose.model('User');

function register(username, password, errorCallback, successCallback) {
  if(username.length < 8 || password.length < 8){
    console.log('username password too short');
    errorCallback({message:'USERNAME PASSWORD TOO SHORT'});
  }
  else{
    User.find({'username': username},(err, result, count) =>{
      if(result.length > 0){
        console.log('duplicate username');
        errorCallback({message: 'USERNAME ALREADY EXISTS'});
      }
      else {
        bcrypt.hash(password, 10, function(err, hash){
          const newUser = new User({
            username: username,
            password: hash,
            list:[]
          });
          //console.log(newUser);
          newUser.save((err, result) => {
            if(err !== null){
              console.log(err);
              errorCallback({message: 'DOCUMENT SAVE ERROR'});
            }
            else {
              successCallback(newUser);
            }
          });
        });
      }
    });
  }
}

function login(username, password, errorCallback, successCallback) {
  User.findOne({username: username}, (err, user, count) => {
    console.log(user);
    if (!user) {
      console.log('no such user');
      errorCallback({message:'USER NOT FOUND'});
    }
    else {
      bcrypt.compare(password, user.password, (err, passwordMatch) => {
        if(passwordMatch){
          successCallback(user);
        }
        else {
          console.log('password not match');
          errorCallback({message:'PASSWORDS DO NOT MATCH'});
        }
      });
    }
  });
}

function startAuthenticatedSession(req, user, cb) {
  req.session.regenerate((err) => {
    if(err){
      console.log(err);
      cb(err);
    }
    else {
      req.session.user = user;
      cb();
    }
  });
}

module.exports = {
  startAuthenticatedSession: startAuthenticatedSession,
  register: register,
  login: login
};
