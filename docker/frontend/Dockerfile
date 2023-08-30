FROM node:latest

WORKDIR /app

COPY entrypoint.sh ../

ARG IP

ENV REACT_APP_IP=$IP
ENV WDS_SOCKET_PORT=0

RUN chmod +x ../entrypoint.sh

EXPOSE 3000

ENTRYPOINT [ "sh", "../entrypoint.sh" ]
