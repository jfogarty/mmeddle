var page = require('webpage').create(),
  system = require('system'),
  t, address;

if (system.args.length === 1) {
  console.log('Usage: node node_modules\phantomjs\bin\phantomjs PhantomLoad.js <some URL>');
  phantom.exit();
}

t = Date.now();
address = system.args[1];
if (address.indexOf('//') < 0) {
  address = 'file:///C:/jf/js/mmeddle/' + address;
}

console.log('- Opening:', address);
page.open(address, function(status) {
  if (status !== 'success') {
    console.log('FAIL to load the address');
  } else {
    t = Date.now() - t;
    console.log('Loading ' + system.args[1]);
    console.log('Loading time ' + t + ' msec');
  }
  phantom.exit();
});
