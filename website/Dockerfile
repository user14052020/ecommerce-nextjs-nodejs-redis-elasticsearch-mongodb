FROM node:18-bullseye-slim

WORKDIR /app

ARG API_URL
ARG WEBSITE_URL
ARG IMG_URL
ARG NEXT_PUBLIC_API_URL
ARG NEXT_PUBLIC_WEBSITE_URL
ARG NEXT_PUBLIC_IMG_URL
ARG API_URL_INTERNAL

ENV API_URL=${API_URL}
ENV WEBSITE_URL=${WEBSITE_URL}
ENV IMG_URL=${IMG_URL}
ENV NEXT_PUBLIC_API_URL=${NEXT_PUBLIC_API_URL}
ENV NEXT_PUBLIC_WEBSITE_URL=${NEXT_PUBLIC_WEBSITE_URL}
ENV NEXT_PUBLIC_IMG_URL=${NEXT_PUBLIC_IMG_URL}
ENV API_URL_INTERNAL=${API_URL_INTERNAL}
ENV NODE_ENV=development
ENV NPM_CONFIG_OMIT=optional
ENV NODE_OPTIONS=--openssl-legacy-provider

COPY website/package*.json website/
RUN cd website \
  && npm install --legacy-peer-deps --include=dev \
  && if [ "$(uname -m)" = "aarch64" ]; then NEXT_VERSION=$(node -p "require('./package.json').dependencies.next"); npm install --legacy-peer-deps --no-save @next/swc-linux-arm64-gnu@$NEXT_VERSION; fi \
  && node -e "const fs=require('fs'); const pkgs=['@types/react','@types/node']; for (const p of pkgs){ const file='node_modules/'+p+'/package.json'; if(!fs.existsSync(file)) { console.log('missing', file); continue; } const j=JSON.parse(fs.readFileSync(file,'utf8')); if(!j.main) j.main='index.d.ts'; if(j.exports) delete j.exports; fs.writeFileSync(file, JSON.stringify(j,null,2)); }" \
  && if [ ! -e /app/node_modules ]; then ln -s /app/website/node_modules /app/node_modules; fi

COPY website website
COPY shared shared
COPY config.js config.js

ENV NODE_ENV=production
RUN cd website && npm run build

EXPOSE 3000

CMD ["sh", "-c", "cd website && npm run start"]
