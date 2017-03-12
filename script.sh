#!/bin/sh

pwd
set
ls -la `pwd`
ls -la /test
NODE_PATH=/test/ nightwatch --reporter=/test/nightwatch.reporter.js --env ci
