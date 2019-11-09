const mongoose = require('mongoose');
const URLSlugs = require('mongoose-url-slugs');

const userSchema = new mongoose.Schema({
  username: String,
  password: String,
  list: Array
});
const reviewSchema = new mongoose.Schema({
  animeName: String,
  title: String,
  content: String,
  reviewer: String,
  rating: Number,
  date: Date
});
const animeSchema = new mongoose.Schema({
  animeName: String,
  animeNameJp: String,
  releaseYear: String,
  description: String,
});

reviewSchema.plugin(URLSlugs('title'));
animeSchema.plugin(URLSlugs('animeName'));
// is the environment variable, NODE_ENV, set to DEV?
let dbconf;
if (process.env.NODE_ENV === 'PRODUCTION') {
 // if we're in DEV mode, then read the configration from a file
 // use blocking file io to do this...
 const fs = require('fs');
 const path = require('path');
 const fn = path.join(__dirname, 'config.json');
 const data = fs.readFileSync(fn);

 // our configuration file will be in json, so parse it and set the
 // conenction string appropriately!
 const conf = JSON.parse(data);
 dbconf = conf.dbconf;
} else {
 // if we're not in DEV mode (the graders are testing your work), then use
 dbconf = 'mongodb://localhost/finalproject';
}

mongoose.model('User', userSchema);
mongoose.model('Review', reviewSchema);
mongoose.model('Anime', animeSchema);
mongoose.connect(dbconf, {useNewUrlParser: true});
