FROM node:20-alpine

WORKDIR /app

COPY package.json ./
COPY yarn.lock ./

RUN yarn --frozen-lockfile

COPY . .

EXPOSE 4001

CMD ["yarn", "run", "start:dev"]
