FROM node:latest

WORKDIR /app

# COPY ./project-name/package.json ./

COPY entrypoint.sh ../

RUN chmod +x ../entrypoint.sh

EXPOSE 5000

ENTRYPOINT [ "sh", "../entrypoint.sh" ]