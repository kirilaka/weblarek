import type { IProduct } from "./Basket";

export class ProductCatalog {
    private arrayItems: IProduct[] = [];
    private selectedItem: IProduct | null = null;

    setArrayItems(array: IProduct[]): void {
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