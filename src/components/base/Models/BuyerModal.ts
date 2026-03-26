import { IBuyer } from "../../../types";

interface IBuyerModel {
    setSomeDataBuyer(data: Partial<IBuyer>): void;
    getDataBayer(): IBuyer;
    resetDataBuyer(): void;
    isValidOrder(): BuyerErrors;
    isValidContacts(): Partial<IBuyer>;
};

type BuyerErrors = Partial<Record<keyof IBuyer, string>>

const initialStateDataBuyer: IBuyer = {
        payment: '',
        email: '',
        phone: '',
        address: ''
    };

export class BuyerModal implements IBuyerModel {
    private dataBayer: IBuyer = initialStateDataBuyer;

    setSomeDataBuyer(data: Partial<IBuyer>): void {
        this.dataBayer = {...this.dataBayer, ...data};
    };

    getDataBayer(): IBuyer { 
        return this.dataBayer 
    };

    resetDataBuyer(): void {
        this.dataBayer = initialStateDataBuyer;
    };

    isValidOrder(): BuyerErrors {
        const errors: BuyerErrors = {}

        if (!this.dataBayer.payment) {
            errors.payment = 'Выберите способ оплаты'
        }

        if (!this.dataBayer.address) {
            errors.address = 'Введите адрес'
        }

        return errors
    }

    isValidContacts(): Partial<IBuyer> {
        const errors: Partial<IBuyer> = {}

        if (!this.dataBayer.email) {
            errors.email = 'Введите email'
        }

        if (!this.dataBayer.phone) {
            errors.phone = 'Введите телефон'
        }

        return errors
    }
};