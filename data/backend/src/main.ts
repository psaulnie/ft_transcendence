import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as process from 'process';
import * as session from 'express-session';
import * as passport from 'passport';
import { TypeormSession } from './entities';
import { TypeormStore } from 'connect-typeorm';
import { DataSource } from 'typeorm';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const port = process.env.PORT;
  const sessionRepo = app.get(DataSource).getRepository(TypeormSession);
  app.use(
    session({
      cookie: {
        maxAge: 86400000, // 1 day
      },
      secret: 'random_string',
      resave: false,
      saveUninitialized: false,
      store: new TypeormStore().connect(sessionRepo),
    }),
  );
  app.use(cookieParser());
  app.use(passport.initialize());
  app.use(passport.session());
  app.enableCors({
    origin: `http://${process.env.IP}:3000`,
    credentials: true, // Allow cookies
  });
  await app.listen(port, () => {
    console.log(`Running on port ${port}`);
  });
}
bootstrap();
