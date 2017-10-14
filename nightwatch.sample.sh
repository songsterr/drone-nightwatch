#!/bin/sh

# NOTE: Create nightwatch.sh in your project based on this sample

function prefix {
  while read -r line; do
    echo -e "$1 $line"
  done
}

# Run two parallel tests with different set of test cases
yarn nightwatch -e firefox --skiptags skip_firefox "$@" 2>&1 | prefix '\033[97m\033[41m[firefox]\033[0m' &
yarn nightwatch -e chrome --skiptags skip_chrome "$@" 2>&1 | prefix '\033[97m\033[44m[chrome]\033[0m ' &

# Wait for completion
wait
