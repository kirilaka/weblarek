import './scss/styles.scss';
import { ProductModel } from './components/Models/ProductModel';
import { BasketModel} from './components/Models/BasketModel';
import { Api } from './components/base/Api';
import { BuyerModel } from './components/Models/BuyerModel';
import { API_URL } from './utils/constants';
import { WebLarekApi } from './components/Models/WebLarekApi';
import { EventEmitter } from './components/base/Events';
import { cloneTemplate, ensureElement } from './utils/utils';
import { CardBasket, CardCatalog, CardPreview } from './components/View/Cards';
import { Gallery } from './components/View/Gallery';
import { Modal } from './components/View/Modal';
import { Header } from './components/View/Header';
import { Basket } from './components/View/Basket';
import { FormContacts, FormOrder } from './components/View/Forms';
import { OrderSuccess } from './components/View/OrderSuccess';
import { IProduct } from './types';

const events = new EventEmitter();
const api = new Api(API_URL);
const webLarekApi = new WebLarekApi(api)
const productModel = new ProductModel(events);
const basketModel = new BasketModel(events);
const buyerModel= new BuyerModel(events);
const basket = new Basket(ensureElement(cloneTemplate('#basket')), events)

let isBasketOpen = false;

async function init(): Promise<IProduct[]> {
    try {
        const product = await webLarekApi.getProducts()
        return product.items
    } catch(error) {
        throw error
    }
}

const productList: IProduct[] = await init();

const gallery = new Gallery(ensureElement('.gallery'))
const modal = new Modal(ensureElement('.modal'), events)
const header = new Header(ensureElement('.header'), events)

let orderForm: FormOrder | null = null
let contactsForm: FormContacts | null = null

events.on('catalog:change', () => {
    const itemCards = productModel.getArrayItems()?.map((item) => {
        const card = new CardCatalog(cloneTemplate('#card-catalog'), {
            onClick: () => productModel.setItemForDisplay(item)
        });
        return card.render(item);
    });

    gallery.render({catalog: itemCards})
})

productModel.setArrayItems(productList)

events.on('card:click', () => {
    modal.clear()
    const product = productModel.getItemForDisplay()
    if (!product) return 
    const cardPreview = new CardPreview(cloneTemplate('#card-preview'), {
        onClick: () => {
            if(basketModel.isProductById(product.id)) {
                basketModel.deleteProduct(product)
                cardPreview.noInBasket()
                modal.close()
            } else {
                basketModel.addProduct(product)
                cardPreview.InBasket()
                modal.close()
            }
        }
    })
    cardPreview.setButtonText(product.price)
    const card = cardPreview.render(product)
    if (basketModel.isProductById(product.id)) {
        cardPreview.InBasket()
    } else {
        cardPreview.noInBasket()
    }
    modal.render({content: card})
    modal.open();
})

events.on('basket:change', () => {
    header.render({counter: basketModel.getTotalProducts()})
    if (isBasketOpen) {
        events.emit('basket:open')
    }
})

events.on('basket:open', () => {
    isBasketOpen = true
    modal.clear()
    const itemBasket = basketModel.getProducts().map((item, index) => {
        const cardBasket = new CardBasket(ensureElement(cloneTemplate('#card-basket')), {onClick: () => basketModel.deleteProduct(item)})
        return cardBasket.render({
            ...item,
            index: index + 1
        })
    })
    const contentBasket = basket.render({basketList: itemBasket, total: basketModel.getPrice()})
    modal.render({content: contentBasket})
    modal.open()
})

events.on('form:open', () => {
    modal.clear()
    orderForm = new FormOrder(cloneTemplate('#order'), events)
    
    const formElement = orderForm.render({
        ...buyerModel.getDataBayer(),
    })

    modal.render({ content: formElement })
})

events.on('order:payment-changed', (payment) => {
    buyerModel.setSomeDataBuyer(payment)
})

events.on('order:address-changed', (address) => {
    buyerModel.setSomeDataBuyer(address)
})

events.on('buyer:change', () => {
    const allErrors = buyerModel.isValid()

    const orderFields = ['payment', 'address']
    const contactsFields = ['email', 'phone']

    const errorsOrder = Object.fromEntries(
        Object.entries(allErrors).filter(([key]) =>
            orderFields.includes(key)
        )
    )

    const errorscontacts = Object.fromEntries(
        Object.entries(allErrors).filter(([key]) =>
            contactsFields.includes(key)
        )
    )

    orderForm?.render({
        ...buyerModel.getDataBayer(),
        disabled: Object.keys(errorsOrder).length > 0,
        errorText: Object.values(errorsOrder).join(', ')
    })

    contactsForm?.render({
        ...buyerModel.getDataBayer(),
        disabled: Object.keys(errorscontacts).length > 0,
        errorText: Object.values(errorscontacts).join(', ')
    })
})

events.on('order:next-form', () => {
    contactsForm = new FormContacts(cloneTemplate('#contacts'), events)

    const formElement = contactsForm.render({
        ...buyerModel.getDataBayer(),
    })

    modal.render({ content: formElement })
})

events.on('order:email-changed', (email) => {
    buyerModel.setSomeDataBuyer(email)
})

events.on('order:phone-changed', (phone) => {
    buyerModel.setSomeDataBuyer(phone)
})

events.on('order:submit', async () => {
    try {
        const dataBayer = buyerModel.getDataBayer()
        const total = basketModel.getPrice()
        const items = basketModel.getIdsProducts()

        const postData = { ...dataBayer, total, items }

        const response = await webLarekApi.postOrder(postData)

        events.emit('success:open', response)
    } catch (e) {
        console.log('Что-то пошло не так: ', e)
    }
})

events.on('success:open', (response) => {
    isBasketOpen = false
    const orderSuccess = new OrderSuccess(ensureElement(cloneTemplate('#success')), events)
    const successElement = orderSuccess.render(response)
    modal.render({content: successElement})
    modal.open()
    basketModel.emptyBasket()
    buyerModel.resetDataBuyer()
})

events.on('order-success:close', () => {
    isBasketOpen = false
    modal.close()
})