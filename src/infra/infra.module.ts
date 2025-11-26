// src/infra/infra.module.ts
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { RmqService } from './rmq/rmq.service';

@Module({
  imports: [ConfigModule],
  providers: [RmqService],
  exports: [RmqService],
})
export class InfraModule {}
