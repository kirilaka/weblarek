import type { IProduct } from "../../../types/index.ts"

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
        const item = this.arrayItems.find(item => item.id === id);
        this.selectedItem = item ? item : null;
    }

    getItemForDisplay(): IProduct | null {
        return this.selectedItem;
    }
}