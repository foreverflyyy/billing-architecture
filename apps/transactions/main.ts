import {NestFactory} from '@nestjs/core';
import {AppModule} from './app.module';
import {RmqOptions, Transport} from "@nestjs/microservices";

async function start() {
    const app = await NestFactory.create(AppModule);

    app.connectMicroservice<RmqOptions>({
        transport: Transport.RMQ,
        options: {
            urls: [process.env.RABBIT_URL!],
            queue: process.env.PAYMENT_QUEUE,
            noAck: false,
            queueOptions: {
                durable: false
            }
        }
    });
    app.connectMicroservice<RmqOptions>({
        transport: Transport.RMQ,
        options: {
            urls: [process.env.RABBIT_URL!],
            queue: process.env.REMOVAL_QUEUE,
            noAck: false,
            queueOptions: {
                durable: false
            }
        }
    });
    await app.startAllMicroservices();

    const PORT = process.env.PORT || 6060;
    await app.listen(PORT, () => console.log(`Server started on port: ${PORT}`));
}

(async () => {
    await start();
})();