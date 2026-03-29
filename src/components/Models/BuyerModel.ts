import { IBuyer } from "../../types";
import { IEvents } from "../base/Events";

type BuyerErrors = Partial<Record<keyof IBuyer, string>>;

interface IBuyerModel {
    setSomeDataBuyer(data: Partial<IBuyer>): void;
    getDataBayer(): IBuyer;
    resetDataBuyer(): void;
    isValid(): BuyerErrors; 
};

const initialStateDataBuyer: IBuyer = {
        payment: '',
        email: '',
        phone: '',
        address: ''
    };

export class BuyerModel implements IBuyerModel {
    private dataBayer: IBuyer = initialStateDataBuyer;

    constructor(protected events: IEvents) {}

    setSomeDataBuyer(data: Partial<IBuyer>): void {
        this.dataBayer = {...this.dataBayer, ...data};
        this.events.emit('buyer:change')
    };

    getDataBayer(): IBuyer { 
        return this.dataBayer 
    };

    resetDataBuyer(): void {
        this.dataBayer = initialStateDataBuyer;
        this.events.emit('buyer:change')
    };

    isValid(): BuyerErrors { 
    if (!Object.values(this.dataBayer).some(value => value == '')) return {} 
    const data = Object.entries(this.dataBayer);
    const errors = data.reduce((acc, [key, value]) => { 
        if (!value) { 
            let message = '';
            switch (key) { 
                case 'payment': 
                    message = "Выберите способ оплаты"; 
                    break; 
                case 'email': 
                    message = "Введите email"; 
                    break; 
                case 'phone': 
                    message = "Введите номер телефона"; 
                    break; 
                case 'address': 
                    message = "Выберите адрес"; 
                    break; 
            }
            acc[key as keyof IBuyer] = message;
        }
        return acc; 
    }, {} as BuyerErrors);

    return errors;
}
};