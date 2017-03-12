FROM mhart/alpine-node:7.7.2

RUN apk --no-cache add git python \
 && npm install -g nightwatch \
 && mkdir -p /test/

ADD nightwatch.reporter.js /test/
ADD script.sh /bin/

RUN chmod +x /bin/script.sh
ENTRYPOINT /bin/script.sh
