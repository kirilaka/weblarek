import { IApi } from "../../types";
import { IGetProductsResponse } from "../../types";
import { IPostOrderResponse } from "../../types";
import { IPostOrderRequest } from "../../types";

export class WebLarekApi {
    private api: IApi;

    constructor(api: IApi) {
        this.api = api;
    }

    async getProducts(): Promise<IGetProductsResponse> {
        return await this.api.get("/product/");
    }
    
    async postOrder(data: IPostOrderRequest): Promise<IPostOrderResponse> {
        return await this.api.post("/order/", data);
    }
}


