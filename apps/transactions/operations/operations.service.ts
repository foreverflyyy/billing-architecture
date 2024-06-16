import {Injectable} from '@nestjs/common';
import {TransactionsRepository} from "../database/repositories";
import {TransactionStatus} from "../database/schemas";
import {ErrorTransactionData} from "./operation.dto";

@Injectable()
export class OperationsService {
    constructor(
        private readonly transactionRepository: TransactionsRepository
    ) {
    }

    async assignSuccessTransaction(id: string) {
        const updatedTransaction = await this.transactionRepository.findOneAndUpdate(
            {_id: id},
            {success: true}
        );

        if (!updatedTransaction) {
            await this.transactionRepository.findOneAndUpdate(
                {_id: id},
                {success: false, status: TransactionStatus.ERROR, err: updatedTransaction}
            );
            return "Не удалось обновить запись транзакции.";
        }

        return updatedTransaction;
    }

    async assignErrorTransaction(data: ErrorTransactionData) {
        const {transactionId, text: errorText} = data;
        const updatedTransaction = await this.transactionRepository.findOneAndUpdate(
            {_id: transactionId},
            {err: errorText}
        );

        if (!updatedTransaction) {
            return "Не удалось обновить запись транзакции.";
        }

        return updatedTransaction;
    }
}
