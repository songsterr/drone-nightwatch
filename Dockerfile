FROM mhart/alpine-node:7.7.2

RUN apk --no-cache add git python \
 && npm install -g nightwatch request \
 && mkdir -p /test/

COPY nightwatch.reporter.js /test/

ENTRYPOINT nightwatch --reporter=/test/nightwatch.reporter.js --env ci
