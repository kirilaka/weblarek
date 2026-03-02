import { IProduct } from "../components/base/Models/Basket";

export type ApiPostMethods = 'POST' | 'PUT' | 'DELETE';

export interface IApi {
    get<T extends object>(uri: string): Promise<T>;
    post<T extends object>(uri: string, data: object, method?: ApiPostMethods): Promise<T>;
}

type TPayment = "card" | "cash" | '';

export interface IBuyer {
    payment: TPayment;
    email: string;
    phone: string;
    address: string;
}

export interface IGetProductsResponse { 
    items: IProduct[],
    total: number
}


export interface IPostOrderResponse { 
    id: string,
    total: number
}

export interface IPostOrderRequest extends IBuyer {
    total: number,
    items: string[]
} 
