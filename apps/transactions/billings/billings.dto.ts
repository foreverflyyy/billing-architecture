import {BillingType} from "../common";

export interface CreateNewBillingData {
    userId: string;
    name: string;
    type: BillingType;
}