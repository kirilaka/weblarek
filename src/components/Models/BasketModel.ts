import { IProduct } from "../../types";
import { IEvents } from "../base/Events";

export class BasketModel {
    private arrayProduct: IProduct[] = [];

    constructor(protected events: IEvents) {}

    getProducts(): IProduct[] {
        return this.arrayProduct
    }

    addProduct(product: IProduct): void {
        if (!this.isProductById(product.id)) {
            this.arrayProduct.push(product);
        }
        this.events.emit('basket:change')
    }

    deleteProduct(product: IProduct): void {
       const index = this.arrayProduct.findIndex(item => item.id === product.id);
        if (index !== -1) {
            this.arrayProduct.splice(index, 1);
        }
        this.events.emit('basket:change')
    }

    emptyBasket(): void {
        this.arrayProduct = []
        this.events.emit('basket:change')
    }

    getPrice(): number {
        return this.arrayProduct.reduce((total, item) => {
            return item.price !== null ? total + item.price : total;
        }, 0);
    }

    getTotalProducts(): number {
        return this.arrayProduct.length
    }

    isProductById(id: string): boolean {
        return this.arrayProduct.some(item => item.id === id)
    }
}