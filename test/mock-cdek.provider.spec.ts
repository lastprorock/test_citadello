import { MockCdekProvider } from '../src/providers/mock-cdek/mock-cdek.service';
import { DeliveryRequestDto } from '../src/shared/dto/delivery-request.dto';

describe('MockCdekProvider', () => {
    const provider = new MockCdekProvider();

    it('should calculate price based on weight (ceil * 100)', async () => {
        const req: DeliveryRequestDto = {
            cart: {
                weightKg: 2.3,
            },
            destination: {
                country: 'RU',
                city: 'Москва',
            },
            currency: 'RUB',
        };

        const options = await provider.calculateOptions(req);
        expect(options).toHaveLength(1);
        expect(options[0].price).toBe(300); // ceil(2.3) * 100
        expect(options[0].providerCode).toBe('mock-cdek');
    });

    it('should return empty array for non-positive weight', async () => {
        const req: DeliveryRequestDto = {
            cart: {
                weightKg: 0,
            },
            destination: {
                country: 'RU',
                city: 'Москва',
            },
        };

        const options = await provider.calculateOptions(req);
        expect(options).toHaveLength(0);
    });
});
