import { Controller, Logger } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { DeliveryCoreService } from '../../delivery/core/core.service';
import { EventsPublisherService } from '../publisher/publisher.service';
import { DeliveryRequestDto } from '../../shared/dto/delivery-request.dto';
import { DeliveryResponseDto } from '../../shared/dto/delivery-response.dto';

interface DeliveryOptionsRequestedEvent extends DeliveryRequestDto {
    orderId?: string;
}

@Controller()
export class EventsSubscriberController {
    private readonly logger = new Logger(EventsSubscriberController.name);

    constructor(
        private readonly deliveryCoreService: DeliveryCoreService,
        private readonly eventsPublisher: EventsPublisherService,
    ) {}

    @MessagePattern('delivery.options.requested')
    async handleDeliveryOptionsRequested(
        @Payload() data: DeliveryOptionsRequestedEvent,
    ): Promise<DeliveryResponseDto> {
        this.logger.debug(
            `Received "delivery.options.requested" for orderId=${data.orderId}`,
        );


        const { orderId, ...request } = data;
        const response = await this.deliveryCoreService.calculateOptions(
            request as DeliveryRequestDto,
        );

        await this.eventsPublisher.publishDeliveryOptionsCalculated(
            orderId,
            response,
        );

        return response;
    }
}
