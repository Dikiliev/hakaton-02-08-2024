# Frontend Dockerfile
FROM node:18

# Set working directory
WORKDIR /app

# Install dependencies
COPY package.json yarn.lock /app/
RUN yarn install

# Copy project files
COPY . /app/

# Build the project
RUN yarn build

# Serve the built project using a simple server
RUN yarn global add serve
CMD ["serve", "-s", "dist"]
