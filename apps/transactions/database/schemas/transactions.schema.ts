import {AbstractSchema} from "./abstract.schema";
import mongoose, {HydratedDocument} from 'mongoose';
import {Prop, Schema, SchemaFactory} from '@nestjs/mongoose';

export enum TypeOperation {
    PAYMENT = "PAYMENT",
    REMOVAL = "REMOVAL",
    CREATE_BILLING = "CREATE_BILLING"
}

export enum TransactionStatus {
    PROGRESS = "PROGRESS",
    ERROR = "ERROR",
    SUCCESS = "SUCCESS"
}

export interface ITransactionSchema {
    _id: mongoose.Types.ObjectId;
    user: string | mongoose.Types.ObjectId;
    type: TypeOperation;
    err: string;
    lastChange: Date;
    createdAt: Date;
}

@Schema()
export class Transaction extends AbstractSchema implements ITransactionSchema {
    @Prop({type: String, required: true})
    user: string | mongoose.Types.ObjectId;

    @Prop({type: String, required: true})
    type: TypeOperation;

    @Prop({type: Boolean, default: TransactionStatus.PROGRESS})
    status: TransactionStatus;

    @Prop({type: String, default: ""})
    err: string;

    @Prop({type: Date, default: Date.now()})
    lastChange: Date;

    @Prop({type: Date, default: Date.now()})
    createdAt: Date;
}

export type TransactionDocument = HydratedDocument<Transaction>;

export const TransactionSchema = SchemaFactory.createForClass(Transaction);