FROM node:22-alpine

RUN mkdir -p /src/app

WORKDIR /src/app

COPY ./api /src/app

RUN npm install

EXPOSE 8080

CMD ["npm", "start"]