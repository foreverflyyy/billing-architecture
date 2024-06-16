import {Inject, Injectable} from '@nestjs/common';
import {TransactionsRepository} from "../database/repositories";
import {TransactionStatus, TypeOperation} from "../database/schemas";
import {CreateNewBillingData} from "./billings.dto";
import {RABBIT_BILLING_SERVICE} from "../common";
import {ClientProxy} from "@nestjs/microservices";

@Injectable()
export class BillingsService {
    constructor(
        private readonly transactionRepository: TransactionsRepository,
        @Inject(RABBIT_BILLING_SERVICE) private billingRabbit: ClientProxy
    ) {
    }

    async createNewBilling(data: CreateNewBillingData) {
        const {userId, type, name} = data;
        const createdTransaction = await this.transactionRepository.create({
            user: userId, type: TypeOperation.CREATE_BILLING, status: TransactionStatus.PROGRESS
        });

        if (!createdTransaction) {
            return "Не удалось создать заявку на счёт.";
        }

        this.billingRabbit.emit("create_new_billing", {
            userId: userId,
            billingName: name,
            billingType: type
        });

        return createdTransaction;
    }
}
