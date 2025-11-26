import { ShippingProvider } from '../shipping-provider.interface';
import { DeliveryRequestDto } from '../../shared/dto/delivery-request.dto';
import { DeliveryOption } from '../../shared/types/delivery.types';

const CITY_TARIFFS: Record<string, number> = {
    'Москва': 300,
    'Казань': 500,
    'Санкт-Петербург': 400,
};

export class MockBoxberryProvider implements ShippingProvider {
    readonly code = 'mock-boxberry';

    async calculateOptions(
        req: DeliveryRequestDto,
    ): Promise<DeliveryOption[]> {
        const city = req.destination.city;
        const price = CITY_TARIFFS[city];

        if (!price) {
            return [];
        }

        return [
            {
                providerCode: this.code,
                serviceName: 'Mock Boxberry City Tariff',
                deliveryType: 'pickup',
                price,
                currency: req.currency ?? 'RUB',
                estimatedDays: {
                    min: 3,
                    max: 6,
                },
            },
        ];
    }
}
