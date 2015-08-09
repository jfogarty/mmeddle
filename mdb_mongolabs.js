var mongoose = require('mongoose');

console.log('- Connect to OpenShift MongoDB database.');
var db = mongoose.connection;

db.on('error', console.error);
db.once('open', workWithDb);

// set OPENSHIFT_MONGODB_DB_URL=mongodb://admin:Rmp-YcCBVm2A@127.10.79.130:27017/
// MONGOLAB: mongodb://<dbuser>:<dbpassword>@ds061621.mongolab.com:61621/mmspace
// var MONGODB_DB_URL = process.env.MONGODB_DB_URL;
var MONGODB_DB_URL="mongodb://jfogarty:iegc123@ds061621.mongolab.com:61621/mmspace;
mongoose.connect(MONGODB_DB_URL);
console.log('- Connecting to :', MONGODB_DB_URL, '...');

function workWithDb() {
  console.log('- Connected to :', MONGODB_DB_URL);

  var movieSchema = new mongoose.Schema({
    title: { type: String }
  , rating: String
  , releaseYear: Number
  , hasCreditCookie: Boolean
  });

  // Compile a 'Movie' model using the movieSchema as the structure.
  // Mongoose also creates a MongoDB collection called 'Movies' for these documents.
  var Movie = mongoose.model('Movie', movieSchema);
  
  var mve = new Movie({
      title: 'To Kill A Mockingbird'
    , rating: 'G'
    , releaseYear: '1965' 
    , hasCreditCookie: false
  });

  mve.save(function(err, mv) {
    if (err) return console.error(err);
    console.log('- Saved a movie');
    console.dir(mv);
    console.log('----------------------------');
  });
  
  var mve2 = new Movie({
      title: 'A Tale of Two Cities'
    , rating: 'G'
    , releaseYear: '1935' 
    , hasCreditCookie: false
  });

  mve2.save(function(err, mv) {
    if (err) return console.error(err);
    console.log('- Saved movie2');
    console.dir(mv);
    console.log('----------------------------');
  });  
}