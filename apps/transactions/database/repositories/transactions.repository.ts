import {Model} from 'mongoose';
import {Injectable} from '@nestjs/common';
import {InjectModel} from '@nestjs/mongoose';

import {Transaction} from "../schemas";
import {AbstractRepository} from "./abstract.repository";

@Injectable()
export class TransactionsRepository extends AbstractRepository<Transaction> {
    constructor(
        @InjectModel(Transaction.name) private transactionModel: Model<Transaction>
    ) {
        super(transactionModel);
    }
}