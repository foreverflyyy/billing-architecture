import Joi from "joi";
import path from "path";
import {Module} from '@nestjs/common';
import {ConfigModule} from "@nestjs/config";
import {MongooseModule} from "@nestjs/mongoose";
import {OperationsService} from './operations.service';
import {OperationsController} from './operations.controller';
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
        ])
    ],
    controllers: [OperationsController],
    providers: [OperationsService, TransactionsRepository],
})
export class OperationsModule {
}
