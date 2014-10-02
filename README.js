tap-inquire
===========

Make a checklist and keep running tests until they pass

## Purpose

The use of this module was originally for making installer checklists for ops, not for creating unit tests.

## Example

```javascript
var inquire = require('tap-inquire').inquire;
var fs = require('fs');
var path = require('path');
inquire(function (test, done) {
  test('test for stat() working on ./tap-inquire.test', function (t) {
      t.plan(2);
      t.pass('I pass. So, I am disabled');
      fs.stat(path.join(process.cwd(), 'tap-inquire.test'), function (err) {
        if (err) {
          t.fail('Unable to stat() ./tap-inquire.test, does it exist and have the right permissions?');
        }
        else {
          t.pass('Able to stat() ./tap-inquire.test');
        }
      })
      t.end();
    });
  done()
});
```
