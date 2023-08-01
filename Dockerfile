FROM node:18-bullseye-slim

WORKDIR /workspace/todoapp

RUN apt update 

RUN apt install -y vim

RUN apt install -y git 

COPY package.json ./

COPY package-lock.json ./

RUN npm install

COPY . .

EXPOSE 3555

# CMD ["node","index.js"]
