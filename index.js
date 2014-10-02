var tape = require('tape');
var inquirer = require('inquirer');
var async = require('async');
var util = require('util');

exports.inquire = function (testerSetup, done) {
  var queued = [];

  function runHarness(spec, next) {
    var harness = tape.createHarness(); 
    var resultStream = harness.createStream({objectMode:true});
    var tests = [];
    var current = null;
    var asserts = null;
    var ok = true;
    resultStream.on('data', function (obj) {
      if (obj.type === 'test') {
        asserts = [];
        ok = true;
        current = obj;
      }
      else if (obj.type === 'end') {
        tests.push({
          test: current,
          asserts: asserts,
          ok: ok
        });
        asserts = null;
        ok = true;
        current = null; 
      }
      else {
        ok = ok && obj.ok; 
        asserts.push(obj);
      }
    });
    resultStream.on('end', function () {
       var ui = new inquirer.ui.BottomBar();
       async.each(tests, function (todo, next) {
         if (todo.ok) {
           ui.log.write(util.format('[+] ok: %s', todo.test.name));
           next(null);
           return;
         }
         inquirer.prompt({
           type: 'checkbox',
           message: todo.test.name, 
           name: 'todo tests',
           choices: todo.asserts.map(function (assert) {
             return {
               name: assert.name,
               disabled: assert.ok,
               checked: assert.ok
             };
           })
         }, function (answers) {
           next(null);
         });
       }, function () {
         ui.close();
         if (tests.filter(function (test) {return test.ok == false}).length) {
           runHarness(spec, next);
         }
         else {
           next(null);
         }
       });
    });
    harness(spec.name, spec.cb);
  }
  testerSetup(function queueTest(name, cb) {
    queued.push({name: name, cb: cb}); 
  }, setupDone);
  function setupDone(err) {
    if (err) {
      done(err);
      return;
    }
    async.each(queued, runHarness, done);
  }
}

