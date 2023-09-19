FROM node:latest

RUN mkdir /avatars

RUN npm update -g npm

WORKDIR /app

COPY entrypoint.sh ../

RUN chmod +x ../entrypoint.sh
COPY default.jpg ../

EXPOSE 5000

ENTRYPOINT [ "sh", "../entrypoint.sh" ]
