FROM node:16.15.1
WORKDIR /home/node/app
COPY app /home/node/app
RUN yarn
CMD yarn start