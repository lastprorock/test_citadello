import { Injectable, Logger } from '@nestjs/common';
import { RmqService } from '../../infra/rmq/rmq.service';
import { DeliveryResponseDto } from '../../shared/dto/delivery-response.dto';

@Injectable()
export class EventsPublisherService {
    private readonly logger = new Logger(EventsPublisherService.name);

    constructor(private readonly rmqService: RmqService) {}

    async publishDeliveryOptionsCalculated(
        orderId: string | undefined,
        response: DeliveryResponseDto,
    ): Promise<void> {
        const payload = {
            orderId,
            ...response,
        };

        this.logger.debug(
            `Publishing "delivery.options.calculated" for orderId=${orderId}`,
        );

        this.rmqService.emit('delivery.options.calculated', payload);
    }
}
