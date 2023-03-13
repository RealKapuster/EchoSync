# build stage
FROM node:16.17.1-alpine as build-stage

WORKDIR /app

RUN apk add g++ make py3-pip

COPY . .
RUN npm install
RUN npm run build

EXPOSE 3000
CMD ["npm", "run", "start"]

# production stage
# todo fix problem with swc and typechain
# FROM nginx:stable-alpine as production-stage
# COPY .nginx/nginx.conf /temp/prod.conf
# RUN envsubst /app < /temp/prod.conf > /etc/nginx/conf.d/default.conf
# COPY --from=build-stage /app/dist /usr/share/nginx/html
# EXPOSE 80
# CMD ["nginx", "-g", "daemon off;"]
