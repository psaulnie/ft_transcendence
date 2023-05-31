FROM node:latest

WORKDIR /app

COPY entrypoint.sh ../

RUN chmod +x ../entrypoint.sh

EXPOSE 3000

ENTRYPOINT [ "sh", "../entrypoint.sh" ]
