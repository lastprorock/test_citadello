import { ApiProperty } from '@nestjs/swagger';

class EstimatedDaysDto {
    @ApiProperty({ example: 2 })
    min: number;

    @ApiProperty({ example: 4 })
    max: number;
}

class DeliveryOptionDto {
    @ApiProperty({ example: 'mock-cdek' })
    providerCode: string;

    @ApiProperty({ example: 'Mock CDEK Standard' })
    serviceName: string;

    @ApiProperty({ example: 'courier' })
    deliveryType: string;

    @ApiProperty({ example: 300 })
    price: number;

    @ApiProperty({ example: 'RUB' })
    currency: string;

    @ApiProperty({ type: EstimatedDaysDto })
    estimatedDays: EstimatedDaysDto;
}

class ProviderErrorDto {
    @ApiProperty({ example: 'mock-boxberry' })
    providerCode: string;

    @ApiProperty({ example: 'City not supported' })
    message: string;
}

export class DeliveryResponseDto {
    @ApiProperty({ type: [DeliveryOptionDto] })
    options: DeliveryOptionDto[];

    @ApiProperty({ type: [ProviderErrorDto] })
    providerErrors: ProviderErrorDto[];
}
