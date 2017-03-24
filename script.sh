#!/bin/sh

PERSON=random nightwatch --reporter=/test/nightwatch.reporter.js --env ci || true
