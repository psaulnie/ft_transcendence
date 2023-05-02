FROM node:latest

WORKDIR /app

#check if needed
RUN npm install @nestjs/typeorm typeorm 
COPY entrypoint.sh ../

RUN chmod +x ../entrypoint.sh

EXPOSE 5000

ENTRYPOINT [ "sh", "../entrypoint.sh" ]