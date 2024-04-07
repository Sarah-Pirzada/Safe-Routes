FROM node:lts AS development

WORKDIR /app

COPY package.json /app/package.json
COPY package-lock.json /app/package-lock.json

RUN npm install

COPY . /app

FROM development AS build

RUN npm run build

EXPOSE 5173

CMD [ "npm", "start" ]
