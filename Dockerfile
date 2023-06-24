FROM node:18-alpine
# ENV NODE_ENV production
WORKDIR /app
COPY . .
RUN npm ci
RUN npm run build
# COPY . .
# RUN tsc
#CMD ["rm", "-rf" , "database" ]
#CMD ["node", "./dist/index.js"]
CMD rm -rf database && mkdir database && node ./dist/index.js
