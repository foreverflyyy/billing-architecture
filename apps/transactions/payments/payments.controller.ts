import {Controller, Get} from '@nestjs/common';
import {PaymentsService} from './payments.service';
import {Ctx, EventPattern, Payload, RmqContext} from "@nestjs/microservices";
import {LegalPaymentData, PhysicalPaymentData} from "./payments.dto";

@Controller()
export class PaymentsController {
    constructor(private readonly paymentService: PaymentsService) {
    }

    @EventPattern("legal_entity_payment")
    async legalPayment(@Payload() data: LegalPaymentData, @Ctx() context: RmqContext) {
        const channel = context.getChannelRef();
        const originalMsg = context.getMessage();

        await this.paymentService.legalPayment(data);
        channel.ack(originalMsg);
    }

    @EventPattern("physical_entity_payment")
    async physicalPayment(@Payload() data: PhysicalPaymentData, @Ctx() context: RmqContext) {
        const channel = context.getChannelRef();
        const originalMsg = context.getMessage();

        await this.paymentService.physicalPayment(data);
        channel.ack(originalMsg);
    }
}
