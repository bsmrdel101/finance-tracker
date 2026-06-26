FROM node:23-slim
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install
COPY . .
RUN npx tsc -p tsconfig.json
CMD [ "node", "dist/index.js" ]
