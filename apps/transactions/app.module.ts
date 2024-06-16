import Joi from "joi";
import path from "path";
import {Module} from '@nestjs/common';
import {ConfigModule} from "@nestjs/config";
import {MongoModule} from "./database/mongo.module";
import {PaymentsModule} from "./payments/payments.module";
import {RemovalModule} from "./removal/removal.module";
import {OperationsModule} from "./operations/operations.module";
import {BillingsModule} from "./billings/billings.module";

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
            validationSchema: Joi.object({
                PORT: Joi.string().required(),
                MONGODB_URL: Joi.string().required(),
                RABBIT_URL: Joi.string().required(),
                BILLING_QUEUE: Joi.string().required(),
            }),
            envFilePath: path.join(__dirname, ".dev.env")
        }),
        MongoModule,
        PaymentsModule,
        RemovalModule,
        OperationsModule,
        BillingsModule
    ]
})
export class AppModule {
}
