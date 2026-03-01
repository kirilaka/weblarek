import { IBuyer } from "../../../types";

interface TBuyer {
    setSomeDataBuyer(data: Partial<IBuyer>): void;
    getDataBayer(): IBuyer;
    resetDataBuyer(): void;
    isValid(): Partial<IBuyer> & {payment?: string};
};

const initialStateDataBuyer: IBuyer = {
        payment: '',
        email: '',
        phone: '',
        address: ''
    };

export class Buyer implements TBuyer {
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

    isValid(): Partial<IBuyer> & {payment?: string} {
        if (!Object.values(this.dataBayer).some(value => value == '')) return {}
        const data = Object.entries(this.dataBayer)
        const errors = data.reduce((acc, [key, value]) => {
            if (!value) {
                switch (key) {
                    case 'payment':
                        value = "Выберите способ оплаты";
                        break;
                    case 'email':
                        value = "Введите email";
                        break;
                    case 'phone':
                        value = "Введите номер телефона";
                        break;
                    case 'address':
                        value = "Выберите адрес";
                        break;
                }
            }
            else { 
                return acc;
            }
            acc.push([key, value]);
            return acc;
        }, [] as [string, string][]);

        return Object.fromEntries(errors)
    }
};