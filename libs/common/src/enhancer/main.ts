// import { NestFactory } from '@nestjs/core';
// import helmet from 'helmet';

// import { setupApp, setupSwagger } from '../config/common';
// import { logger as instance } from '../config/logger.config';
// import { WinstonModule } from 'nest-winston';
// import { NestFactoryStatic } from '@nestjs/core/nest-factory';
// import { ConfigService } from '@nestjs/config';

// async function bootstrap() {
//   const app = await NestFactory.create(AppModule, {
//     logger: WinstonModule.createLogger({ instance }),
//   });

//   const configService = app.get<ConfigService>(ConfigService);
//   const port = configService.get('APP_CONTAINER_PORT');

//   setupApp(app);
//   app.use(helmet());
//   app.enableCors();
//   NestFactoryStatic;
//   setupSwagger(app);
//   await app.listen(port);
//   console.info(`Server listening on port ${port}`);
// }

// void bootstrap();
