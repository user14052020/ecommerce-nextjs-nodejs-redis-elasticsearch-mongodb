FROM node:18-bullseye-slim

WORKDIR /app

ARG API_URL
ARG WEBSITE_URL
ARG IMG_URL

ENV API_URL=${API_URL}
ENV WEBSITE_URL=${WEBSITE_URL}
ENV IMG_URL=${IMG_URL}
ENV NODE_ENV=development
ENV NPM_CONFIG_OMIT=optional
ENV NODE_OPTIONS=--openssl-legacy-provider

COPY website/package*.json website/
RUN cd website \
  && npm install --legacy-peer-deps --include=dev \
  && node -e "const fs=require('fs'); const pkgs=['@types/react','@types/node']; for (const p of pkgs){ const file='node_modules/'+p+'/package.json'; if(!fs.existsSync(file)) { console.log('missing', file); continue; } const j=JSON.parse(fs.readFileSync(file,'utf8')); if(!j.main) j.main='index.d.ts'; if(j.exports) delete j.exports; fs.writeFileSync(file, JSON.stringify(j,null,2)); }"

COPY website website
COPY config.js config.js

ENV NODE_ENV=production
RUN cd website && npm run build

EXPOSE 3000

CMD ["sh", "-c", "cd website && npm run start"]
