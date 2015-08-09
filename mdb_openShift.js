var mongoose = require('mongoose');

console.log('- Connect to OpenShift MongoDB database.');
var db = mongoose.connection;

db.on('error', console.error);
db.once('open', workWithDb);

// set OPENSHIFT_MONGODB_DB_URL=mongodb://admin:Rmp-YcCBVm2A@127.10.79.130:27017/
var OPENSHIFT_MONGODB_DB_URL = process.env.OPENSHIFT_MONGODB_DB_URL;
mongoose.connect(OPENSHIFT_MONGODB_DB_URL + 'mydb');
console.log('- Connecting to :', OPENSHIFT_MONGODB_DB_URL, '...');

function workWithDb() {
  console.log('- Connected to :', OPENSHIFT_MONGODB_DB_URL);

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

  mve.save(function(err, mve) {
    if (err) return console.error(err);
    console.log('- Saved a movie');
    console.dir(mve);
    console.log('----------------------------');
  });
}