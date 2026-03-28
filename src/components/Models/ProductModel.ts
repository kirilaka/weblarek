import { IProduct } from "../../types";
import { CDN_URL } from "../../utils/constants";
import { IEvents } from "../base/Events";

export class ProductModel {
    private arrayItems: IProduct[] = [];
    private selectedItem: IProduct | null = null;

    constructor (protected events: IEvents) {}

    setArrayItems(products: IProduct[]): void {
        products.map(item => item.image = CDN_URL + item.image)
        this.arrayItems = products;
        this.events.emit('catalog:change');
    }

    getArrayItems(): IProduct[] | null {
        return this.arrayItems;
    }

    getItemById(id: string): IProduct | undefined {
        return this.arrayItems.find(item => item.id === id);
    }

    setItemForDisplay(product: IProduct): void {
        this.selectedItem = product;
        this.events.emit('card:click')
    }

    getItemForDisplay(): IProduct | null {
        return this.selectedItem;
    }
}