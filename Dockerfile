# Use an official Node.js image as the base image
FROM --platform=linux/amd64 node:16.13.2

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and yarn.lock to the container
COPY package.json yarn.lock ./

# Install dependencies
RUN yarn install

# Copy the entire project to the container
COPY . .

# Expose port 8080 for the Vite development server
EXPOSE 8080

# Run the development server using Vite
CMD yarn run dev
