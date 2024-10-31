# Use the latest LTS version of Node.js
FROM node:18

# Set the working directory
WORKDIR /usr/src/app

# Copy package.json and package-lock.json to install dependencies
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application files
COPY . .

# Run Prisma generate to initialize the client
RUN npx prisma generate

# Expose the port your app runs on
EXPOSE 3000

# Start the application
CMD ["node", "server.js"]
