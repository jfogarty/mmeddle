'use strict';
var mm = require('./'); // Load the main index.js

  var _ = mm.check(mm._);

  var tuserName = 'mochaTestUser';
  var ptpwd = 'xyzzy';
  var tuser = { 
    name: tuserName,
    ptpwd: ptpwd,
    firstName: 'sir',
    lastName: 'TestUser',
    email: 'notreally@a.value.email.com'
  };  

  function makaUsa () {
    return mm.test.mochaTestConnect()
    .then (function () {
      mm.log('- MAKAUSA [', mm.test.client.cs.appName, ']');
      mm.log('-------------- CONNECTED 1.');
      var cs = mm.test.client.cs;
      return cs.userLogin(tuserName, ptpwd, false, _.assign({}, tuser))
      .then(function (user) {
        mm.log('- Created (maybe)', user);
        return true;
      });
    });
  }

  function loginaUsa () {
    mm.log('- LOGINAUSA');
    return mm.test.mochaTestConnect()
    .then (function () {
      mm.log('-------------- CONNECTED 2.');
      var cs = mm.test.client.cs;
      return cs.userLogin(tuserName, ptpwd)
      .then(function (user) {
        mm.log('- Logged in a second time (also maybe)', user);
        return true;
      });
    })
  }

  mm.log('Promiseme: ', makaUsa().then(loginaUsa));
  mm.log('------------------------------------------');