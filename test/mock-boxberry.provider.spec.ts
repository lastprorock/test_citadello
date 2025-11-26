import { MockBoxberryProvider } from '../src/providers/mock-boxberry/mock-boxberry.service';
import { DeliveryRequestDto } from '../src/shared/dto/delivery-request.dto';

describe('MockBoxberryProvider', () => {
    const provider = new MockBoxberryProvider();

    it('should return option for supported city (Москва)', async () => {
        const req: DeliveryRequestDto = {
            cart: {
                weightKg: 1,
            },
            destination: {
                country: 'RU',
                city: 'Москва',
            },
            currency: 'RUB',
        };

        const options = await provider.calculateOptions(req);
        expect(options).toHaveLength(1);
        expect(options[0].price).toBe(300);
        expect(options[0].providerCode).toBe('mock-boxberry');
    });

    it('should return empty array for unsupported city', async () => {
        const req: DeliveryRequestDto = {
            cart: {
                weightKg: 1,
            },
            destination: {
                country: 'RU',
                city: 'Новосибирск',
            },
        };

        const options = await provider.calculateOptions(req);
        expect(options).toHaveLength(0);
    });
});
