# Drone 0.5 plugin for Nightwatch tests

## Usage:

Put following lines in your .drone.yml

    pipeline:
      nightwatch:
        image: songsterr/drone-nightwatch

and to nightwatch.conf.js:

    module.exports = {
      test_settings: {
        ci: { // required environment name
          launch_url: 'https://.../', 
          selenium_host: '127.0.0.1',
          selenium_port: 4444,
          output_folder: ".", // must not be false
          ...
        }
      }
    }

Set slack Incoming Webhook URL for notifications
 
    $ export DRONE_SERVER=https://ci.terra.songsterr.com
    $ export DRONE_TOKEN=<GET YOUR TOKEN AT https://ci.terra.songsterr.com/account>
    $ drone org secret add --skip-verify=true --image='songsterr/drone-nightwatch' songsterr SECRET_NIGHTWATCH_SLACK_WEBHOOK_URL https://hooks.slack.com/services/....
