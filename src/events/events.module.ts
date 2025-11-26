// src/events/events.module.ts
import { Module } from '@nestjs/common';
import { EventsPublisherService } from './publisher/publisher.service';
import { EventsSubscriberController } from './subscriber/subscriber.service';
import { InfraModule } from '../infra/infra.module';
import { SharedModule } from '../shared/shared.module';
import { DeliveryModule } from '../delivery/delivery.module';

@Module({
  imports: [
    InfraModule,
    SharedModule,
    DeliveryModule
  ],
  providers: [EventsPublisherService],
  controllers: [EventsSubscriberController],
  exports: [EventsPublisherService],
})
export class EventsModule {}
