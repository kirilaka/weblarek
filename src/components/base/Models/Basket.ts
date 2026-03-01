import type { IProduct } from "../../../types/index.js"

export class Basket {
    private arrayProduct: IProduct[] = [];

    getProducts(): IProduct[] {
        return this.arrayProduct
    }

    setProduct(product: IProduct): void {
        if (!this.isProductById(product.id)) {
            this.arrayProduct.push(product);
        }
    }

    deleteProduct(product: IProduct): void {
       const index = this.arrayProduct.findIndex(item => item.id === product.id);
        if (index !== -1) {
            this.arrayProduct.splice(index, 1);
        }
    }

    emptyBasket(): void {
        this.arrayProduct = []
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

    getIdsProducts(): string[] {
        return this.arrayProduct.reduce((acc, item) => {
            acc.push(item.id);
            return acc;
        },[] as string[])
    }
}