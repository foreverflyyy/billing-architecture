export interface LegalPaymentData {
    userId: string;
    inn: number;
    amount: number;
    companyName: string;
}

export interface PhysicalPaymentData {
    userId: string;
    inn: number;
    amount: number;
}
