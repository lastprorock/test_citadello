import { ShippingProvider } from '../shipping-provider.interface';
import { DeliveryRequestDto } from '../../shared/dto/delivery-request.dto';
import { DeliveryOption } from '../../shared/types/delivery.types';

export class MockCdekProvider implements ShippingProvider {
    readonly code = 'mock-cdek';

    async calculateOptions(
        req: DeliveryRequestDto,
    ): Promise<DeliveryOption[]> {
        const weight = req.cart.weightKg;

        if (!weight || weight <= 0) {
            return [];
        }

        const price = Math.ceil(weight) * 100;

        return [
            {
                providerCode: this.code,
                serviceName: 'Mock CDEK Standard',
                deliveryType: 'courier',
                price,
                currency: req.currency ?? 'RUB',
                estimatedDays: {
                    min: 2,
                    max: 4,
                },
            },
        ];
    }
}
