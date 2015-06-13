// Insert the Services Abstraction Layer dependencies.
module.exports = function(mm) {
  mm.storage = require('./storage')(mm);
  
  mm.storage.providers.MongoDBProvider = require('./MongoDBProvider')(mm);
  mm.storage.providers.FileProvider = require('./FileProvider')(mm);
  mm.storage.StorageEngine = require('./StorageEngine')(mm);
  mm.storage.LocalStorage = require('./LocalStorage')(mm);

  mm.storage.StorageClient = require('./StorageClient')(mm);

  mm.users = require('./users')(mm);
  mm.userStorage = require('./userStorage')(mm);

  mm.users.ClientUser = require('./ClientUser')(mm);
  
  mm.mockSock = require('./MockSock')(mm);  
};
