import {Controller} from '@nestjs/common';
import {OperationsService} from './operations.service';
import {Ctx, EventPattern, Payload, RmqContext} from "@nestjs/microservices";
import {ConfirmSuccessTransactionData, ErrorTransactionData} from "./operation.dto";

@Controller()
export class OperationsController {
    constructor(private readonly operationsService: OperationsService) {
    }

    @EventPattern("confirm_success_transaction")
    async confirmSuccessTransaction(@Payload() data: ConfirmSuccessTransactionData, @Ctx() context: RmqContext) {
        const channel = context.getChannelRef();
        const originalMsg = context.getMessage();

        await this.operationsService.assignSuccessTransaction(data.transactionId);
        channel.ack(originalMsg);
    }

    @EventPattern("error_transaction")
    async errorTransaction(@Payload() data: ErrorTransactionData, @Ctx() context: RmqContext) {
        const channel = context.getChannelRef();
        const originalMsg = context.getMessage();

        await this.operationsService.assignErrorTransaction(data);
        channel.ack(originalMsg);
    }
}
