import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { SharedModule } from './shared/shared.module';
import { InfraModule } from './infra/infra.module';
import { ProvidersModule } from './providers/providers.module';
import { EventsModule } from './events/events.module';
import { DeliveryModule } from './delivery/delivery.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env', '.env.local'],
    }),
    SharedModule,
    InfraModule,
    ProvidersModule,
    EventsModule,
    DeliveryModule,
  ],
})
export class AppModule {}
