#!/bin/sh

yarn install --ignore-scripts
yarn nightwatch -- --env ci
