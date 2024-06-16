import {Module} from '@nestjs/common';
import {ConfigService} from '@nestjs/config';
import {MongooseModule} from '@nestjs/mongoose';
import {MongoService} from "./mongo.service";

@Module({
    imports: [
        MongooseModule.forRootAsync({
            imports: [],
            useFactory: (configService: ConfigService) => ({
                uri: configService.get<string>("NODE_ENV") === "test"
                  ? configService.get<string>("MONGO_TEST_URL")
                  : configService.get<string>("MONGODB_URL")
            }),
            inject: [ConfigService]
        })
    ],
    providers: [MongoService],
    exports: [MongoService]
})
export class MongoModule {}