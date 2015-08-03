// Insert the Services Abstraction Layer dependencies.
module.exports = function(mm) {
  //mm.storage = require('./storage')(mm);

  mm.storage = {};
  mm.storage.providers = {};
  mm.storage.LocalStorage  = require('./LocalStorage')(mm);
  mm.storage.StoragePath   = require('./StoragePath')(mm);
  mm.storage.StorageInfo   = require('./StorageInfo')(mm);
  mm.storage.StorageEngine = require('./StorageEngine')(mm);
  mm.storage.StorageClient = require('./StorageClient')(mm);
  
  if (mm.config.inNode) {
    mm.storage.providers.MongoDBProvider = require('./MongoDBProvider')(mm);
    mm.storage.providers.FileProvider    = require('./FileProvider')(mm);
  }
  mm.storage.providers.ClientProvider  = require('./ClientProvider')(mm);
 
  mm.users = {};
  mm.users.ClientUser = require('./ClientUser')(mm);
};
