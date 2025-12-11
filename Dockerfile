FROM node:24-alpine AS build
WORKDIR /app

COPY package*.json ./
RUN npm install
COPY . .

# Build (env gets injected here)
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 8080
RUN sed -i 's/80/8080/g' /etc/nginx/conf.d/default.conf

CMD ["nginx", "-g", "daemon off;"]
