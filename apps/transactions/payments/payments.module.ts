import Joi from "joi";
import path from "path";
import {Module} from '@nestjs/common';
import {ConfigModule} from "@nestjs/config";
import {MongooseModule} from "@nestjs/mongoose";
import {RABBIT_BILLING_SERVICE} from "../common";
import {PaymentsService} from './payments.service';
import {PaymentsController} from './payments.controller';
import {ClientsModule, Transport} from "@nestjs/microservices";
import {TransactionsRepository} from "../database/repositories";
import {Transaction, TransactionSchema} from "../database/schemas";

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
            validationSchema: Joi.object({
                RABBIT_URL: Joi.string().required(),
                BILLING_QUEUE: Joi.string().required(),
                PAYMENT_QUEUE: Joi.string().required()
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
    controllers: [PaymentsController],
    providers: [PaymentsService, TransactionsRepository],
})
export class PaymentsModule {
}
