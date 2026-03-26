import type { IProduct } from "./BasketModal";
import { CDN_URL } from "../../../utils/constants";

export class ProductModal {
    private arrayItems: IProduct[] = [];
    private selectedItem: IProduct | null = null;

    setArrayItems(array: IProduct[]): void {
        array.map(item => item.image = CDN_URL + item.image)
        this.arrayItems = array;
    }

    getArrayItems(): IProduct[] | null {
        return this.arrayItems;
    }

    getItemById(id: string): IProduct | undefined {
        return this.arrayItems.find(item => item.id === id);
    }

    setItemForDisplay(id: string): void {
        const item = this.getItemById(id);
        this.selectedItem = item ?? null;
    }

    getItemForDisplay(): IProduct | null {
        return this.selectedItem;
    }
}