#!/bin/sh

yarn nightwatch --reporter=/test/nightwatch.reporter.js --env ci_firefox,ci_chrome --suiteRetries 3 || true
