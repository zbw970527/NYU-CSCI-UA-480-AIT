const mongoose = require('mongoose');
// schema goes here!
const soundSchema = new mongoose.Schema({
  what: String,
  where: String,
  date: String,
  hour: Number,
  desc: String,
  s_id: String
});
// is the environment variable, NODE_ENV, set to DEV?
let dbconf;
if (process.env.NODE_ENV === 'DEV') {
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
 dbconf = 'mongodb://localhost/hw05';
}

mongoose.model('Sound', soundSchema);
mongoose.connect(dbconf, {useNewUrlParser: true});
