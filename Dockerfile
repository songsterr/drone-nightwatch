FROM node:8.3.0-alpine

RUN apk --no-cache add git python \
 && npm install -g nightwatch \
 && mkdir -p /test/

ADD nightwatch.reporter.js /test/
ADD script.sh /bin/

RUN chmod +x /bin/script.sh
ENTRYPOINT /bin/script.sh
