# Build Angular App
FROM node:16-alpine as build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build --prod

# Serve with Nginx
FROM nginx:alpine
COPY --from=build /app/dist/front /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf
