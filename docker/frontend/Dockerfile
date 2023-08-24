FROM node:latest

WORKDIR /app

COPY entrypoint.sh ../

ARG IP

ENV REACT_APP_IP=$IP

RUN chmod +x ../entrypoint.sh

EXPOSE 3000

ENTRYPOINT [ "sh", "../entrypoint.sh" ]
