FROM node:latest

WORKDIR /app

#check if needed
RUN npm install --save-dev @nestjs/typeorm typeorm
RUN npm install --save-dev @nestjs/websockets @nestjs/platform-socket.io
RUN npm install

COPY entrypoint.sh ../

RUN chmod +x ../entrypoint.sh

EXPOSE 5000

ENTRYPOINT [ "sh", "../entrypoint.sh" ]