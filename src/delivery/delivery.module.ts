// src/delivery/delivery.module.ts
import { Module } from '@nestjs/common';
import { DeliveryApiController } from './api/api.controller';
import { DeliveryCoreService } from './core/core.service';
import { SharedModule } from '../shared/shared.module';
import { ProvidersModule } from '../providers/providers.module';

@Module({
  imports: [
    SharedModule,
    ProvidersModule, // тут лежат mock-провайдеры и их реестр
  ],
  controllers: [DeliveryApiController],
  providers: [DeliveryCoreService],
  exports: [DeliveryCoreService],
})
export class DeliveryModule {}
