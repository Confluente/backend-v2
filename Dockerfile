# Use the official Node.js 16 as a parent image
FROM node:16

# Set the working directory in the container to /app
WORKDIR /app

# Copy the current directory contents into the container at /app
COPY . /app

# Install any needed packages specified in package.json and package-lock.json
# Including dev dependencies for running tests and other pre-start setup
RUN npm install && npm install --only=dev

# Run tests to ensure the backend is installed correctly
RUN npm run tests

# Generate the initial database
RUN npm run gendb

# Make port 81 available to the world outside this container
# Assuming your expressServer listens on port 81
EXPOSE 81

# Define environment variable
# You can define environment variables here that your application uses
# ENV NODE_ENV=production

# Run the app when the container launches
CMD ["npm", "run", "start"]
