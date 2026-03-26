import './scss/styles.scss';
import { ProductModal } from '../components/base/Models/ProductModal';
import { BasketModal } from '../components/base/Models/BasketModal';
import { Api } from '../components/base/Api';
import { BuyerModal } from '../components/base/Models/BuyerModal';
import { API_URL } from '../utils/constants';
import { WebLarekApi } from '../components/base/Models/WebLarekApi';
import { IGetProductsResponse } from '../types';

const api = new Api(API_URL);
const webLarekApi = new WebLarekApi(api)
const product = new ProductModal();
const basket = new BasketModal();
const buyer = new BuyerModal();

const productList: Awaited<IGetProductsResponse> = await webLarekApi.getProducts();
product.setArrayItems(productList.items)

export const test = () => {
    product.setArrayItems(productList.items) //сохранение массива товаров полученного в параметрах метода.
    product.setItemForDisplay(productList.items[1].id) //сохранение товара для подробного отображения.
    console.log(`получение массива товаров из модели:`, product.getArrayItems())
    console.log(`получение одного товара по его id:`, product.getItemById(productList.items[1].id))
    console.log(`получение товара для подробного отображения:`, product.getItemForDisplay())

    basket.addProduct(productList.items[1]) //добавление товара, который был получен в параметре, в массив корзины.
    basket.addProduct(productList.items[2]) //добавление товара, который был получен в параметре, в массив корзины.
    console.log(`получение массива товаров, которые находятся в корзине:`, basket.getProducts())
    console.log(`получение стоимости всех товаров в корзине:`, basket.getPrice())
    console.log(`получение количества товаров в корзине:`, basket.getTotalProducts())
    console.log(`проверка наличия товара в корзине по его id, полученного в параметр метода:`, basket.isProductById(productList.items[1].id))
    console.log(`получение id всех товаров из корзины:`, basket.getIdsProducts())
    basket.deleteProduct(productList.items[2]) //удаление товара, полученного в параметре из массива корзины.
    console.log(`получение масива товаров после удаления одного элемента:`, basket.getProducts())
    basket.emptyBasket() //очистка корзины.
    console.log(`получение масива товаров после очистки корзины:`, basket.getProducts())

    basket.addProduct(productList.items[3])

    buyer.setSomeDataBuyer({payment: "online", email: "wewew@mail.ru", phone: "89235", address: "kokoshneine32"})
    console.log(`получение всех данных покупателя:`, buyer.getDataBayer())
    console.log(`валидация данных:`, buyer.isValidContacts())
    buyer.resetDataBuyer() //получение всех данных покупателя.
    console.log(`получение всех данных покупателя после очистки данных:`, buyer.getDataBayer())
    buyer.setSomeDataBuyer({payment: "online", email: "wewew@mail.ru", phone: "89235", address: "kokoshneine32"})
    postOrder();
}

const postOrder = () => { 
    const dataBayer = buyer.getDataBayer()
    const total = basket.getPrice()
    const items = basket.getIdsProducts()
    const postData = { ...dataBayer, total, items }
    console.log(`ответ POST запроса:`, webLarekApi.postOrder(postData));
}