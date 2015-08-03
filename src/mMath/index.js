module.exports = function(mm) {
  mm.mMath = {};
  mm.mMath.MMath  = require('./MMath')(mm);
  mm.mMath.Parser = require('./Parser')(mm);
  
  require('./nde')(mm);
};
