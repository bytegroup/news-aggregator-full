FROM node:20.14.0
WORKDIR /app
COPY package.json ./
COPY yarn.lock ./
RUN yarn install
COPY . .
EXPOSE 3000
CMD ["yarn", "start"]