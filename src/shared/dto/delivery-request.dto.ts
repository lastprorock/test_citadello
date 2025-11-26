import {
    IsNumber,
    IsOptional,
    IsString,
    ValidateNested,
    IsNotEmpty,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

class DimensionsDto {
    @ApiProperty({ example: 30 })
    @IsNumber()
    length: number;

    @ApiProperty({ example: 20 })
    @IsNumber()
    width: number;

    @ApiProperty({ example: 15 })
    @IsNumber()
    height: number;
}

class CartDto {
    @ApiProperty({ example: 2.5 })
    @IsNumber()
    weightKg: number;

    @ApiProperty({ type: DimensionsDto, required: false })
    @ValidateNested()
    @Type(() => DimensionsDto)
    @IsOptional()
    dimensionsCm?: DimensionsDto;

    @ApiProperty({ example: 3500, required: false })
    @IsNumber()
    @IsOptional()
    totalPrice?: number;
}

class DestinationDto {
    @ApiProperty({ example: 'RU' })
    @IsString()
    country: string;

    @ApiProperty({ example: 'Москва' })
    @IsString()
    city: string;

    @ApiProperty({ example: '101000', required: false })
    @IsString()
    @IsOptional()
    postalCode?: string;
}

export class DeliveryRequestDto {
    @ApiProperty({ type: CartDto })
    @ValidateNested()
    @Type(() => CartDto)
    cart: CartDto;

    @ApiProperty({ type: DestinationDto })
    @ValidateNested()
    @Type(() => DestinationDto)
    destination: DestinationDto;

    @ApiProperty({ example: 'RUB', required: false })
    @IsString()
    @IsOptional()
    currency?: string;
}
