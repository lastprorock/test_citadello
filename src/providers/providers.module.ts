import { Module } from '@nestjs/common';
import { MockCdekProvider } from './mock-cdek/mock-cdek.service';
import { MockBoxberryProvider } from './mock-boxberry/mock-boxberry.service';
import { ShippingProvider } from './shipping-provider.interface';

export const SHIPPING_PROVIDERS = 'SHIPPING_PROVIDERS';

@Module({
  providers: [
    {
      provide: SHIPPING_PROVIDERS,
      useFactory: (): ShippingProvider[] => {
        return [
          new MockCdekProvider(),
          new MockBoxberryProvider(),
        ];
      },
    },
  ],
  exports: [SHIPPING_PROVIDERS],
})
export class ProvidersModule {}
