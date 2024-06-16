import {Module} from '@nestjs/common';
import {RemovalService} from './removal.service';
import {RemovalController} from './removal.controller';
import {MongooseModule} from "@nestjs/mongoose";
import {TransactionsRepository} from "../database/repositories";
import {Transaction, TransactionSchema} from "../database/schemas";
import {ConfigModule} from "@nestjs/config";
import Joi from "joi";
import path from "path";
import {ClientsModule, Transport} from "@nestjs/microservices";
import {RABBIT_BILLING_SERVICE} from "../common";

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
            validationSchema: Joi.object({
                RABBIT_URL: Joi.string().required(),
                BILLING_QUEUE: Joi.string().required(),
                REMOVAL_QUEUE: Joi.string().required()
            }),
            envFilePath: path.join(__dirname, ".dev.env")
        }),
        MongooseModule.forFeature([
            {name: Transaction.name, schema: TransactionSchema}
        ]),
        ClientsModule.register([
            {
                name: RABBIT_BILLING_SERVICE,
                transport: Transport.RMQ,
                options: {
                    urls: [process.env.RABBIT_URL!],
                    queue: process.env.BILLING_QUEUE,
                    queueOptions: {
                        durable: false
                    }
                }
            }
        ]),
    ],
    controllers: [RemovalController],
    providers: [
        RemovalService, TransactionsRepository
    ],
})
export class RemovalModule {
}
