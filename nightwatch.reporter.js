// Original: https://raw.githubusercontent.com/ngs/nightwatch-slack-reporter/master/lib/reporter.js
// this file is here because version in npm is obsolete

var IncomingWebhook = require('@slack/client').IncomingWebhook
  , assign = require('object-assign')
  ;

function write(results, options, done) {
  var webhookURL = process.env.SECRET_SLACK_WEBHOOK_URL || options.slack_webhook_url || (options.globals || {}).slack_webhook_url
    , sendOnlyOnFailure = options.slack_send_only_on_failure || (options.globals || {}).slack_slack_send_only_on_failure || false
    , sendOnlyFailedTests = options.slack_send_only_failed_tests || (options.globals || {}).slack_send_only_failed_tests || false
    , modules = results.modules || {}
    , attachments = []
    , message, wh, completed, skipped, color
    ;
  if (!webhookURL) {
    console.warn('[slack-reporter] Slack Webhook URL is not configured.');
    return done();
  }
  wh = new IncomingWebhook(webhookURL);

  if(sendOnlyOnFailure && results.failed < 1){
    return done();
  }

  message = options.slack_message || (options.globals || {}).slack_message || {};
  if (typeof message === 'function') {
    message = message.apply(this, [results, options]);
  }
  if (typeof message === 'string') {
    message = { text: message };
  }

  Object.keys(modules).map(function(moduleName) {
    var module = modules[moduleName] || {}
      , completed = module.completed || {}
      , fields = []
      ;
    Object.keys(completed).forEach(function(testName) {
      var test = completed[testName]
        , skipped = test.skipped > 0
        , failed = test.failed + test.errors > 0
        , assertions = test.assertions || []
        , color = failed ? 'danger' : skipped ? 'warning' : 'good'
        , text = assertions.length + ' assertions, ' + test.time + ' seconds elapsed'
        , fields = []
        ;

      if(sendOnlyFailedTests && failed < 1){
        return;
      }

      assertions.forEach(function(a) {
        if (a.failure) {
          fields.push({
            title: a.message,
            value: a.failure
          })
          if(options.printFailureAssertionOnly){
            attachments.push({
              color: color,
              title: testName,
              footer: moduleName,
              text: text,
              fields: fields
            });
          }
        }
      })

      if(!options.printFailureAssertionOnly){
        attachments.push({
          color: color,
          title: testName,
          footer: moduleName,
          text: text,
          fields: fields
        });
      }
    });
  });



  wh.send(assign({
    attachments: attachments.filter((a, i) => i<=5)
  }, message), done);
}

var reporter = require('./nightwatch.reporter.js')

var options = {
  slack_message: function(results, options) {
    var branch = (process.env.CI) ? (' of '+ process.env.DRONE_REPO_NAME + ':' + process.env.DRONE_BRANCH) : ''

    var passedMessage = (results.passed) ?  ', passed ' + results.passed : ''
    var skippedMessage = (results.skipped) ?  ', skipped ' + results.skipped : ''
    var failedMessage = (results.failed) ?  ', alternatively passed ' + results.failed : ''
    var errorsMessage = (results.errors) ?  ', not working ' + results.errors : ''

    return {
      text: 'Test' + branch + ' completed, passed ' + results.passed + failedMessage + errorsMessage,
    }
  },
  slack_send_only_on_failure: false,
  slack_send_only_failed_tests: true
}

function reporter(options) {
  return function reporter(results, done) {
    write(results, options, done);
  }
}

reporter.write = write;

module.exports = reporter(options);
