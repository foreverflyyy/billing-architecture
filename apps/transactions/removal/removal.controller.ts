import {Controller} from '@nestjs/common';
import {RemovalData} from "./removal.dto";
import {RemovalService} from './removal.service';
import {Ctx, EventPattern, Payload, RmqContext} from "@nestjs/microservices";

@Controller()
export class RemovalController {
    constructor(private readonly removalService: RemovalService) {
    }

    @EventPattern("removal_money")
    async removalMoney(@Payload() data: RemovalData, @Ctx() context: RmqContext) {
        const channel = context.getChannelRef();
        const originalMsg = context.getMessage();

        await this.removalService.removalMoney(data);
        channel.ack(originalMsg);
    }
}
