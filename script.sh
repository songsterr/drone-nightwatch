#!/bin/sh

PERSON=random nightwatch --reporter=/test/nightwatch.reporter.js --env ci --test tests/*.js || true
