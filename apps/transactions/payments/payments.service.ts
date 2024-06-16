import {Inject, Injectable} from '@nestjs/common';
import {TransactionsRepository} from "../database/repositories";
import {RABBIT_BILLING_SERVICE} from "../common";
import {ClientProxy} from "@nestjs/microservices";
import {LegalPaymentData, PhysicalPaymentData} from "./payments.dto";
import {TransactionStatus, TypeOperation} from "../database/schemas";

@Injectable()
export class PaymentsService {
    constructor(
        private readonly transactionRepository: TransactionsRepository,
        @Inject(RABBIT_BILLING_SERVICE) private billingRabbit: ClientProxy
    ) {
    }

    async legalPayment(data: LegalPaymentData) {
        const {userId, companyName, inn, amount} = data;
        const createdTransaction = await this.transactionRepository.create({
            user: userId, type: TypeOperation.PAYMENT, status: TransactionStatus.PROGRESS
        });

        this.billingRabbit.emit("legal_payment", {
            userId: userId,
            amount: amount,
            transactionId: createdTransaction._id
        });

        return "Создана заявка по пополнению счёта юр. лица";
    }

    async physicalPayment(data: PhysicalPaymentData) {
        const {userId, inn, amount} = data;
        const createdTransaction = await this.transactionRepository.create({
            user: userId, type: TypeOperation.PAYMENT, status: TransactionStatus.PROGRESS
        });

        this.billingRabbit.emit("legal_payment", {
            userId: userId,
            amount: amount,
            transactionId: createdTransaction._id
        });

        return "Создана заявка по пополнению счёта физ. лица";
    }
}
