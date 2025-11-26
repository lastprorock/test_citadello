import { Body, Controller, Post } from '@nestjs/common';
import {
    ApiBody,
    ApiOkResponse,
    ApiOperation,
    ApiTags,
} from '@nestjs/swagger';

import { DeliveryCoreService } from '../core/core.service';
import { DeliveryRequestDto } from '../../shared/dto/delivery-request.dto';
import { DeliveryResponseDto } from '../../shared/dto/delivery-response.dto';

@ApiTags('delivery')
@Controller('shipping')
export class DeliveryApiController {
    constructor(private readonly deliveryCore: DeliveryCoreService) {}

    @Post('options')
    @ApiOperation({
        summary: 'Рассчитать доступные варианты доставки',
        description:
            'Принимает данные корзины и адрес назначения, агрегирует результаты от всех подключённых провайдеров доставки.',
    })
    @ApiBody({ type: DeliveryRequestDto })
    @ApiOkResponse({ type: DeliveryResponseDto })
    async calculateOptions(
        @Body() payload: DeliveryRequestDto,
    ): Promise<DeliveryResponseDto> {
        return this.deliveryCore.calculateOptions(payload);
    }
}
