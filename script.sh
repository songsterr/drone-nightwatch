#!/bin/sh

PERSON=random nightwatch --reporter=/test/nightwatch.reporter.js --env ci --suiteRetries 1 || true
