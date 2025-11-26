import { Inject, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { DeliveryRequestDto } from '../../shared/dto/delivery-request.dto';
import {
    DeliveryOption,
    ProviderError,
} from '../../shared/types/delivery.types';
import { DeliveryResponseDto } from '../../shared/dto/delivery-response.dto';
import { ShippingProvider } from '../../providers/shipping-provider.interface';

@Injectable()
export class DeliveryCoreService {
    private readonly logger = new Logger(DeliveryCoreService.name);
    private readonly providerTimeoutMs: number;

    constructor(
        private readonly configService: ConfigService,

        @Inject('SHIPPING_PROVIDERS')
        private readonly providers: ShippingProvider[],
    ) {
        this.providerTimeoutMs =
            this.configService.get<number>('PROVIDER_TIMEOUT_MS') ?? 1500;
    }

    async calculateOptions(
        req: DeliveryRequestDto,
    ): Promise<DeliveryResponseDto> {
        if (!this.providers || this.providers.length === 0) {
            this.logger.warn('No shipping providers registered');
            return {
                options: [],
                providerErrors: [
                    {
                        providerCode: 'system',
                        message: 'No shipping providers available',
                    },
                ],
            };
        }
        const promises = this.providers.map((provider) =>
            this.callProviderWithTimeout(provider, req),
        );

        const results = await Promise.all(promises);

        const options: DeliveryOption[] = [];
        const providerErrors: ProviderError[] = [];

        for (const result of results) {
            options.push(...result.options);
            providerErrors.push(...result.errors);
        }

        return {
            options,
            providerErrors,
        };
    }

    private async callProviderWithTimeout(
        provider: ShippingProvider,
        req: DeliveryRequestDto,
    ): Promise<{ options: DeliveryOption[]; errors: ProviderError[] }> {
        const timeoutMs = this.providerTimeoutMs;

        const timeoutPromise = new Promise<never>((_, reject) => {
            const id = setTimeout(() => {
                clearTimeout(id);
                reject(new Error('Provider timeout'));
            }, timeoutMs);
        });

        const providerPromise = (async () => {
            try {
                const options = await provider.calculateOptions(req);
                return {
                    options,
                    errors: [] as ProviderError[],
                };
            } catch (err: any) {
                this.logger.error(
                    `Provider "${provider.code}" failed: ${err?.message || err}`,
                );
                return {
                    options: [] as DeliveryOption[],
                    errors: [
                        {
                            providerCode: provider.code,
                            message: 'Provider error',
                        },
                    ],
                };
            }
        })();

        try {
            return await Promise.race([providerPromise, timeoutPromise]);
        } catch (err: any) {
            this.logger.error(
                `Provider "${provider.code}" timed out after ${timeoutMs} ms`,
            );
            return {
                options: [],
                errors: [
                    {
                        providerCode: provider.code,
                        message: 'Provider timeout',
                    },
                ],
            };
        }
    }
}
