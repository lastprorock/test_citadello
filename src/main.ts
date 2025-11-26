import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

import { WinstonModule } from 'nest-winston';
import * as winston from 'winston';

import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {

  const logger = WinstonModule.createLogger({
    transports: [
      new winston.transports.Console({
        level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
        format: winston.format.combine(
            winston.format.timestamp(),
            winston.format.ms(),
            winston.format.colorize(),
            winston.format.printf(({ level, message, timestamp, context, ms }) => {
              const ctx = context ? ` [${context}]` : '';
              const timing = ms ? ` (${ms})` : '';
              return `${timestamp} ${level}${ctx}: ${message}${timing}`;
            }),
        ),
      }),

    ],
  });

  const app = await NestFactory.create(AppModule, {
    logger,
  });

  app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      }),
  );

  app.setGlobalPrefix('v1');

  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.RMQ,
    options: {
      urls: [process.env.RABBITMQ_URL || 'amqp://localhost:5672'],
      queue: process.env.RABBITMQ_QUEUE || 'delivery',
      queueOptions: {
        durable: true,
      },
    },
  });

  const swaggerConfig = new DocumentBuilder()
      .setTitle('Delivery Service')
      .setDescription('Delivery microservice API')
      .setVersion('1.0.0')
      .build();

  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('docs', app, document); // http://localhost:3000/docs

  app.enableShutdownHooks();

  await app.startAllMicroservices();

  const port = process.env.PORT || 3000;
  await app.listen(port);

  logger.log(
      `HTTP API is running on port ${port}`,
      'Bootstrap',
  );
  logger.log(
      `RMQ microservice connected to ${process.env.RABBITMQ_URL || 'amqp://localhost:5672'} queue "${process.env.RABBITMQ_QUEUE || 'delivery_pricing'}"`,
      'Bootstrap',
  );
}

bootstrap();
