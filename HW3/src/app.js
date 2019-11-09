// app.js
const webby = require('./webby.js');
const app = new webby.App();
const path= require('path');
let imageList = ['/img/animal1.jpg', '/img/animal2.jpg', '/img/animal3.jpg', '/img/animal4.jpg'];

app.use(webby.static(path.join(__dirname, '..', "public")));

app.get('/', (req, res) => {
  res.set('Content-Type', 'text/html');
  res.status(200).send('<html><head><link rel="stylesheet" href="/css/styles.css"></head><body><h1>Let\'s see some cats!</h1><a href="/gallery" target="_self">Pleasse show me some cats!</a></body></html>');
});

app.get('/gallery', (req, res) => {
  res.set('Content-Type', 'text/html');
  let num = Math.floor(Math.random() * 10) % 4;
  if(num === 0){
    num = 4;
  }
  let imgbody = '';
  for (var i = 0; i < num; i++) {
    imgbody = imgbody + '<img src="' + imageList[Math.floor(Math.random() * 10) % 4] + '">';
  }
  let headbody = '';
  if(num === 1){
     headbody = '<h1>Here is 1 cat!!!</h1>';
  }
  else {
    headbody = '<h1>Here are '+ num +' cats!!!</h1>';

  }
  res.status(200).send('<html><head><link rel="stylesheet" href="/css/styles.css"></head><body>'+ headbody + imgbody + '</body></html>');
});

app.get('/css/styles.css', (req, res) => {
});

app.get('/img/animal1.jpg', (req, res) => {
});

app.get('/img/animal2.jpg', (req, res) => {
});

app.get('/img/animal3.jpg', (req, res) => {
});

app.get('/img/animal4.jpg', (req, res) => {
});

app.get('/pics', (req, res) => {
  res.set("Location", "/gallery");
  res.status(301).send("go to new page!");
});

app.listen(3000);
