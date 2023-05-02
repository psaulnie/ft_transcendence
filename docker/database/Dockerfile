FROM postgres:latest

RUN touch /docker-entrypoint-initdb.d/db.sql
RUN chmod 777 /docker-entrypoint-initdb.d/
RUN chmod 777 /docker-entrypoint-initdb.d/db.sql

COPY ./entrypoint.sh .
RUN chmod +x entrypoint.sh

RUN service postgresql stop 

ENTRYPOINT [ "sh", "entrypoint.sh" ]
