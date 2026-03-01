import './scss/styles.scss';
import { ProductCatalog } from './components/base/Models/ProductCatalog';
import { Basket } from './components/base/Models/Basket';
import { Api } from './components/base/Api';
import { Buyer } from './components/base/Models/Buyer';
import { API_URL } from './utils/constants';
import { IGetProductsResponse } from './types';  
import { WebLarekApi } from './components/base/Models/WebLarekApi';

const api = new Api(API_URL);
const webLarekApi = new WebLarekApi(api)
const product = new ProductCatalog();
const basket = new Basket();
const buyer = new Buyer();

const productList: Awaited<IGetProductsResponse> = await webLarekApi.getProducts();

product.setArrayItems(productList.items)

buyer.setSomeDataBuyer({payment: "card",
    email: "wewew@mail.ru",
    phone: "string",
    address: "string"})

basket.setProduct(productList.items[3])

const postOrder = () => { 
    const dataBayer = buyer.getDataBayer()
    const total = basket.getPrice()
    const items = basket.getIdsProducts()
    const postData = { ...dataBayer, total, items }
    webLarekApi.postOrder(postData);
}

postOrder()




