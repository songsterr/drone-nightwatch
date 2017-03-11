FROM mhart/alpine-node:7.7.2

RUN npm install -g nightwatch

ADD script.sh /bin/
RUN chmod +x /bin/script.sh
ENTRYPOINT /bin/script.sh
