import { DeliveryRequestDto } from '../shared/dto/delivery-request.dto';
import { DeliveryOption } from '../shared/types/delivery.types';

export interface ShippingProvider {
    readonly code: string;

    calculateOptions(
        req: DeliveryRequestDto,
    ): Promise<DeliveryOption[]>;
}
