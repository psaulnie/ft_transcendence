FROM node:latest

WORKDIR /app

# COPY ./my-app/package.json .

# RUN npm install --prefix /app/

# COPY ./my-app/ .
COPY entrypoint.sh ../

RUN chmod +x ../entrypoint.sh

EXPOSE 3000

ENTRYPOINT [ "sh", "../entrypoint.sh" ]
# CMD ["npm", "start"]