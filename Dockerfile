# Stage 1: Build the React app
FROM node:alpine as react-build
WORKDIR /app
COPY ./client/package.json ./client/package-lock.json ./
RUN npm install

# Files from client are placed inside app
COPY ./client ./
RUN npm run build


# Stage 2: Build the Nest.js API
FROM node:alpine as nest-build
# tentando remover client folder...
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm install
COPY . .
RUN rm -rf client
RUN npm run build:prod

# From client root folder, copies dist files and place it in app/client/dist in the nest app
COPY --from=react-build /app/dist /app/client/dist


EXPOSE 3000

# Command to run your Nest.js API
CMD ["node", "./dist/main"]

