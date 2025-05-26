FROM node:19

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 5000

CMD ["npm", "run", "dev"]

# this basically runs the application in the container

# Use the following command to build the Docker image
# docker build -t my-node-app .
# Use the following command to run the Docker container
# docker run -p 5000:5000 my-node-app
# Use the following command to run the Docker container in detached mode