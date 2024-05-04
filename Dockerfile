# Stage 1: Build the React app
FROM node:alpine as react-build
WORKDIR /app
COPY ./client/package.json ./client/package-lock.json ./
RUN npm install

COPY ./client ./
RUN npm run build


# Stage 2: Build the Nest.js API
FROM node:alpine as nest-build

WORKDIR /app
COPY package.json package-lock.json ./
RUN npm install

COPY . .
RUN rm -rf client
RUN npm run build:prod

FROM node:18-alpine As production

COPY --from=react-build /app/dist /app/client/dist
COPY --from=nest-build /app/dist /app/dist
COPY --from=nest-build /app/node_modules /app/node_modules


EXPOSE 3000

# Command to run your Nest.js API
CMD ["node", "app/dist/main.js"]

