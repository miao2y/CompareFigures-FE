# Use the official Node.js runtime as the base image
#FROM node:18 as build
#
## Set the working directory in the container
#WORKDIR /app
#
## Copy package.json and package-lock.json to the working directory
#COPY package*.json ./
#
## Install dependencies
#RUN yarn config set registry https://registry.npmmirror.com/
#RUN yarn install
#
## Copy the entire application code to the container
#COPY . .
#
## Build the React app for production
#RUN yarn build

# Use Nginx as the production server
FROM node:18

# Copy the built React app to Nginx's web server directory
COPY ./dist ./compare-figures
#COPY ./nginx.conf /etc/nginx/conf.d/default.conf

RUN yarn global add serve

# Start Nginx when the container runs
CMD ["serve", "."]