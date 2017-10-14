# Drone 0.5 plugin for Nightwatch tests with Slack reporter

## Setup:

In your project create `nightwatch.conf.js` with `chrome` and `firefox` environments:

    module.exports = {
      test_settings: {
        chrome: {
          launch_url: 'https://test.example.com/', 
          selenium_host: 'selenium.example.com',
          selenium_port: 4444,
          output_folder: ".", // must not be false
          desiredCapabilities: {
            'browserName': 'chrome',
            ...
          }
          ...
        },
        firefox: {
          launch_url: 'https://test.example.com/', 
          selenium_host: 'selenium.example.com',
          selenium_port: 4444,
          output_folder: ".", // must not be false
          desiredCapabilities: {
            'browserName': 'firefox',
            ...  
          }
          ...
        }
      }
    }
    
And add `./nightwatch.sh` with parallel commands:  

    yarn nightwatch -e firefox --skiptags skip_firefox "$@" &
    yarn nightwatch -e chrome --skiptags skip_chrome "$@" &
    wait

## Usage

Add test step into build pipeline in `.drone.yml`:

    pipeline:
      nightwatch:
        image: songsterr/drone-nightwatch

Set slack Incoming Webhook URL for reports:
 
    $ export DRONE_SERVER=https://drone.example.com
    $ export DRONE_TOKEN=<GET YOUR TOKEN AT https://drone.example.com/account>
    $ drone org secret add --skip-verify=true --image='songsterr/drone-nightwatch' songsterr SECRET_NIGHTWATCH_SLACK_WEBHOOK_URL https://hooks.slack.com/services/....
