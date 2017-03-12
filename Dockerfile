FROM mhart/alpine-node:7.7.2

RUN apk --no-cache add git python
RUN npm install -g yarn

RUN mkdir -p /test/
WORKDIR /test/
COPY package.json yarn.lock  /test/

RUN yarn install && yarn global add nightwatch

ADD script.sh /bin/
RUN chmod +x /bin/script.sh
ENTRYPOINT /bin/script.sh
