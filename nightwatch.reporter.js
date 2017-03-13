// Thanks to https://raw.githubusercontent.com/ngs/nightwatch-slack-reporter/master/lib/reporter.js
const https = require('https')

function write(results, options, done) {
  const webhookURL = process.env.SECRET_NIGHTWATCH_SLACK_WEBHOOK_URL

  if (!webhookURL) {
    console.warn('[slack-reporter] environment SECRET_NIGHTWATCH_SLACK_WEBHOOK_URL is not configured');
    return done();
  }

  const message = {
    attachments: []
  }

  const branch = `<${process.env.DRONE_COMMIT_LINK}|${process.env.DRONE_REPO_NAME}:${process.env.DRONE_BRANCH}>`
  const passedMessage = (results.passed) ?  `, passed ${results.passed}` : ''
  const skippedMessage = (results.skipped) ?  `, skipped ${results.skipped}`: ''
  const failedMessage = (results.failed) ?  `, failed ${results.failed}`: ''
  const errorsMessage = (results.errors) ?  `, not working ${results.errors}` : ''

  const text = `Test of ${branch} completed${passedMessage}${skippedMessage}${failedMessage}${errorsMessage}`
  const color = ((results.failed + results.errors) > 0) ? 'danger' : ((results.skipped > 0) ? 'warning' : 'good')

  message.attachments.push({
    color: color,
    text: text,
    mrkdwn_in: ['text'],
    footer: `<${process.env.DRONE_BUILD_LINK}|build ${process.env.DRONE_BUILD_NUMBER} at ci.terra.songsterr.com>`
  })

  const modules = results.modules || {}
  Object.keys(modules).map(function (moduleName) {
    const module = modules[moduleName] || {}
    const completed = module.completed || {}

    Object.keys(completed).forEach(function (testName) {
      const test = completed[testName]
      const failed = test.failed + test.errors > 0
      const assertions = test.assertions || []

      if (failed < 1 || message.attachments.length >= 10) {
        return
      }

      const fields = assertions
        .filter(a => a.failure)
        .map(a => ({ title: a.message, value: a.failure, short: false }))

      message.attachments.push({
        color: 'danger',
        fallback: testName,
        author_name: testName,
        fields: fields,
        footer: moduleName
      })
    })
  })

  const data = JSON.stringify(message)
  const opts = {
    hostname: "hooks.slack.com",
    port: 443,
    path: webhookURL.replace("https://hooks.slack.com", ""),
    method: 'POST',
    headers: {
      'Content-Length': data.length,
      'Content-Type': 'application/json'
    }
  }

  const req = https.request(opts, (res) => {
    if (res.statusCode !== 200) {
      console.warn(`Notification finished with ${res.statusCode}`)
    }
    done()
  })
  req.on('error', (error) => {
    console.warn("Slack notification error", error)
    done()
  })
  req.write(data)
  req.end()

  // request({ url: webhookURL, method: "POST", json: true, body: message }, (error, response, body) => done())
}

module.exports = {
  write
}
