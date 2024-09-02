FROM node:20.14-alpine

WORKDIR /app

COPY package*.json /app

RUN npm install

COPY . .

CMD ["npm", "run", "start:dev"]