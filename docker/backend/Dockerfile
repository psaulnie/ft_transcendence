FROM node:latest

RUN mkdir /avatars

WORKDIR /app

#check if needed
RUN npm install --save-dev @nestjs/typeorm typeorm
RUN npm install --save-dev @nestjs/websockets @nestjs/platform-socket.io
RUN npm install

COPY entrypoint.sh ../

RUN chmod +x ../entrypoint.sh
COPY default.jpg ../

EXPOSE 5000

ENTRYPOINT [ "sh", "../entrypoint.sh" ]