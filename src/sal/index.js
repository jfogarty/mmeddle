// Insert the Services Abstraction Layer dependencies.
module.exports = function(mm) {
  mm.storage = require('./storage')(mm);
  mm.users = require('./users')(mm);
  mm.userStorage = require('./userStorage')(mm);


};
