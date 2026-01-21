FROM node:18-alpine

WORKDIR /app/backend

RUN apk add --no-cache python3 make g++

COPY backend/package*.json ./
RUN npm install

COPY backend ./

RUN npm run build

EXPOSE 5001

CMD ["node", "dist/server.js"]
