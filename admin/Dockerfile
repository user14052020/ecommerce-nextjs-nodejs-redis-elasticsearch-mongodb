FROM node:18-alpine

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

COPY admin/package*.json admin/
RUN cd admin \
  && npm install --legacy-peer-deps --include=dev \
  && node -e "const fs=require('fs'); const pkgs=['@types/react','@types/node']; for (const p of pkgs){ const file='node_modules/'+p+'/package.json'; if(!fs.existsSync(file)) { console.log('missing', file); continue; } const j=JSON.parse(fs.readFileSync(file,'utf8')); if(!j.main) j.main='index.d.ts'; if(j.exports) delete j.exports; fs.writeFileSync(file, JSON.stringify(j,null,2)); }" \
  && if [ ! -e /app/node_modules ]; then ln -s /app/admin/node_modules /app/node_modules; fi

COPY admin admin
COPY shared shared
COPY config.js config.js

ENV NODE_ENV=production
ENV NEXT_DISABLE_SWC=1
RUN cd admin && npm run build

EXPOSE 8000

CMD ["sh", "-c", "cd admin && npm run start"]
