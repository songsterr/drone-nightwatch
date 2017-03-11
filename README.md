# Drone 0.5 plugin for Nightwatch tests

## Usage:

Put following lines in your .drone.yml

    pipeline:
      nightwatch:
        image: songsterr/drone-nightwatch

Set slack Incoming Webhook URL for notifications
 
    $ export DRONE_SERVER=https://ci.terra.songsterr.com
    $ export DRONE_TOKEN=<GET YOUR TOKEN AT https://ci.terra.songsterr.com/account>
    $ drone org secret add --skip-verify=true --image='songsterr/drone-nightwatch' songsterr SECRET_SLACK_WEBHOOK_URL https://hooks.slack.com/services/....
