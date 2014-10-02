var inquire = require('./index').inquire;
var fs = require('fs');
var path = require('path');
inquire(function (test, done) {
  test('test for stat() working on ./tap-inquire.test', function (t) {
      t.plan(2);
      t.pass('I pass. So, I am disabled');
      var file = path.join(process.cwd(), 'tap-inquire.test')
      fs.stat(file, function (err) {
        if (err) {
          t.fail('Unable to stat() ./tap-inquire.test, does it exist and have the right permissions?');
        }
        else {
          t.pass('Able to stat() ./tap-inquire.test');
        }
      });
    });
  done()
});
