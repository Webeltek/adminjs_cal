FROM node:20

WORKDIR /admin

ENV NODE_ENV="development"
ENV TZ="UTC"

COPY package.json ./
COPY yarn.lock ./
COPY .yalc/ .yalc/
COPY prisma ./prisma/

COPY . .

RUN npm i -g typescript \
&& yarn install \
&& yarn build \
&& npx prisma generate \
&& rm -rf src 

ENV ADMIN_JS_SKIP_BUNDLE="true"

EXPOSE 3000
CMD ["yarn","start"]
