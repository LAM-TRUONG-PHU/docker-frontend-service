FROM node:20-alpine3.19
WORKDIR /usr/src/app
COPY package*.json .
RUN npm install
COPY . .
EXPOSE 5173
CMD ["npm", "run", "dev"]