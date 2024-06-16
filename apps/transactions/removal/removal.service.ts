import {RemovalData} from "./removal.dto";
import {RABBIT_BILLING_SERVICE} from "../common";
import {Inject, Injectable} from '@nestjs/common';
import {ClientProxy} from "@nestjs/microservices";
import {TransactionsRepository} from "../database/repositories";
import {TransactionStatus, TypeOperation} from "../database/schemas";

@Injectable()
export class RemovalService {
    constructor(
        private readonly transactionRepository: TransactionsRepository,
        @Inject(RABBIT_BILLING_SERVICE) private billingRabbit: ClientProxy
    ) {
    }

    async removalMoney(data: RemovalData) {
        const {userId, amount} = data;
        const createdTransaction = await this.transactionRepository.create({
            user: userId, type: TypeOperation.REMOVAL, status: TransactionStatus.PROGRESS
        });

        this.billingRabbit.emit("removal_money", {
            userId: userId,
            amount: amount,
            transactionId: createdTransaction._id
        });

        return "Создана заявка на списание средств со счёта";
    }
}
