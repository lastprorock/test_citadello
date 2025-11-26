// src/infra/rmq.service.ts
import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import {
    ClientProxy,
    ClientProxyFactory,
    Transport,
} from '@nestjs/microservices';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class RmqService implements OnModuleInit, OnModuleDestroy {
    private client!: ClientProxy;

    constructor(private readonly configService: ConfigService) {}

    onModuleInit() {
        const urls = [this.configService.get<string>('RABBITMQ_URL') || 'amqp://localhost:5672'];
        const queue = this.configService.get<string>('RABBITMQ_QUEUE') || 'delivery_pricing';

        this.client = ClientProxyFactory.create({
            transport: Transport.RMQ,
            options: {
                urls,
                queue,
                queueOptions: {
                    durable: true,
                },
            },
        });
    }

    async onModuleDestroy() {
        if (this.client) {
            await this.client.close();
        }
    }

    getClient(): ClientProxy {
        return this.client;
    }

    emit(pattern: string, data: any) {
        return this.client.emit(pattern, data);
    }
    send<TResult = any, TInput = any>(pattern: string, data: TInput) {
        return this.client.send<TResult, TInput>(pattern, data);
    }
}
