FROM node:latest

WORKDIR /app

RUN npm update -g npm

COPY entrypoint.sh ../

ARG IP

ENV VITE_IP=$IP
ENV WDS_SOCKET_PORT=0

RUN chmod +x ../entrypoint.sh

EXPOSE 3000

ENTRYPOINT [ "sh", "../entrypoint.sh" ]
