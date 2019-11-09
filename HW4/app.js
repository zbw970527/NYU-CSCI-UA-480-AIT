// Bowen Zhang
const express = require('express');

const app = express();
app.set('view engine', 'hbs');

app.use(express.static('public'));
app.use(express.urlencoded({extended: false}));

const paintings = [{'image' : "\n _______________\n |~|_________|~|\n |::::\\^o^/::::|\n ---------------\n |..|/     \\|..|\n ---        ----\n |  |       |  |\n |  |       |  |\n |  |       |  |\n.|__|.     .|__|.",
                'date' : "2018-09-29",
                'title' : "washington sq arch",
                'tags' : ["architecture", "public"]},
                {'image' : "\n  ______\n  ======\n /      \\\n|        |-.\n|        |  \\\n|O.o:.o8o|_ /\n|.o.8o.O.|\n \\.o:o.o/",
                'date' : "2018-09-30",
                'title' : "boba",
                'tags' : ["snack", "notmybestwork"]},
                {'image': "       ___\n      /  /\\   |---.\n      |__|/__ |---,\\\n      |  `   |=    `\n      |      /|\n      |  .--' |\n      |   |\\  |\n      |   | \\ |\n     /|   | | |\n    \\/    |  \\|\n___ /_____\\___|\\____",
                'date' : "2018-10-31",
                'title' : "buddy",
                'tags' : ["halloween", "squad", "fashion"]}
              ];

app.get('/', (req, res)=>{
  let kw = "";
  if(req.query.filter !== undefined){
    kw = req.query.filter;
  }
  if(kw === ""){
    res.render('template', {'paintings': paintings.slice().reverse()});
  }else {
    const context = paintings.filter(obj => obj['tags'].includes(kw) === true);
    res.render('template', {'paintings': context.slice().reverse()});
  }
});

app.post('/', (req, res) => {
  const keyword = req.body['tag'];
  res.redirect('/?filter='+keyword);
});

app.get('/add', (req, res)=>{
  res.render('add');
});

app.post('/add', (req, res)=>{
  //console.log(req.body);
  paintings.push({'image': req.body['image'], 'date': req.body['date'], 'title': req.body['title'], 'tags': req.body['tags'].split(' ') });
  res.redirect('/');
});

app.listen(3000);
