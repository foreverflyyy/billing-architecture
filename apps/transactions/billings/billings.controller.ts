import {Controller} from '@nestjs/common';
import {BillingsService} from './billings.service';
import {CreateNewBillingData} from "./billings.dto";
import {Ctx, EventPattern, Payload, RmqContext} from "@nestjs/microservices";

@Controller()
export class BillingsController {
    constructor(private readonly billingsService: BillingsService) {
    }

    @EventPattern("create_new_billing")
    async confirmSuccessTransaction(@Payload() data: CreateNewBillingData, @Ctx() context: RmqContext) {
        const channel = context.getChannelRef();
        const originalMsg = context.getMessage();

        await this.billingsService.createNewBilling(data);
        channel.ack(originalMsg);
    }
}
