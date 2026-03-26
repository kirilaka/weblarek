import './scss/styles.scss';
import { ProductModal } from './components/base/Models/ProductModal';
import { BasketModal, IProduct } from './components/base/Models/BasketModal';
import { Api } from './components/base/Api';
import { BuyerModal } from './components/base/Models/BuyerModal';
import { API_URL } from './utils/constants';
import { IGetProductsResponse } from './types';  
import { WebLarekApi } from './components/base/Models/WebLarekApi';
import { EventEmitter } from './components/base/Events';
import { cloneTemplate, ensureElement } from './utils/utils';
import { CardBasket, CardCatalog, CardPreview } from './components/base/View/Cards';
import { Gallery } from './components/base/View/Gallery';
import { Modal } from './components/base/View/Modal';
import { Header } from './components/base/View/Header';
import { Basket } from './components/base/View/Basket';
import { FormContacts, FormOrder } from './components/base/View/Forms';
import { OrderSuccess } from './components/base/View/OrderSuccess';

const api = new Api(API_URL);
const webLarekApi = new WebLarekApi(api)
const productModal = new ProductModal();
const basketModal = new BasketModal();
const buyerModal= new BuyerModal();

const productList: Awaited<IGetProductsResponse> = await webLarekApi.getProducts();
productModal.setArrayItems(productList.items)

const events = new EventEmitter();
const gallery = new Gallery(ensureElement('.gallery'))
const modal = new Modal(ensureElement('.modal'), events)
const header = new Header(ensureElement('.header'), events)

let clonePreview: CardPreview | null = null
let orderForm: FormOrder | null = null
let contactsForm: FormContacts | null = null

events.on('catalog:show', () => {
    const itemCards = productModal.getArrayItems()?.map((item) => {
        const card = new CardCatalog(cloneTemplate('#card-catalog'), {
            onClick: () => events.emit('card:click', item)
        });
        return card.render(item);
    });

    gallery.render({catalog: itemCards})
})

events.emit('catalog:show');

events.on('card:click', (item: IProduct) => {
    modal.clear()
    const cardPreview = new CardPreview(cloneTemplate('#card-preview'), {
        onClick: () => events.emit('add:basket', item)
    })
    const card = cardPreview.render(item)

    if (item.price === null) {
    } else if (basketModal.isProductById(item.id)) {
        cardPreview.InBasket()
    } else {
        cardPreview.noInBasket()
    }

    modal.render({content: card})
    modal.open();
    clonePreview = cardPreview
})

events.on('add:basket', (item: IProduct) => {
    if(!basketModal.isProductById(item.id)) {
        basketModal.addProduct(item)
        clonePreview?.InBasket()
    } else {
        basketModal.deleteProduct(item)
        clonePreview?.noInBasket()
    }

    events.emit('counter:change')
})

events.on('counter:change', () => {
    header.render({counter: basketModal.getTotalProducts()})
})

events.on('basket:open', () => {
    modal.clear()
    const basket = new Basket(ensureElement(cloneTemplate('#basket')), events, {onClick: () => events.emit('form:open')})
    const itemBasket = basketModal.getProducts().map((item, index) => {
        const cardBasket = new CardBasket(ensureElement(cloneTemplate('#card-basket')), {onClick: () => events.emit('basket:del-item', item)})
        return cardBasket.render({
            ...item,
            index: index + 1
        })
    })
    const contentBasket = basket.render({basketList: itemBasket, total: basketModal.getPrice()})
    modal.render({content: contentBasket})
    modal.open()
})

events.on('basket:del-item', (item: IProduct) => {
    basketModal.deleteProduct(item)
    events.emit('basket:open')
    events.emit('counter:change')
})

events.on('form:open', () => {
    modal.clear()
    const errors = buyerModal.isValidOrder()
    orderForm = new FormOrder(cloneTemplate('#order'), events)
    
    const formElement = orderForm.render({
        ...buyerModal.getDataBayer(),
        disabled: Object.keys(errors).length > 0,
        errorText: Object.values(errors).join(', ')
    })

    modal.render({ content: formElement })
})

events.on('order:form-update', (errors) => {
    if (!orderForm) return

    orderForm.render({
        disabled: Object.keys(errors).length > 0,
        errorText: Object.values(errors).join(', ')
    })
})

events.on('order:next-form', () => {
    const errors = buyerModal.isValidOrder()
    if (Object.keys(errors).length > 0) {
        events.emit('form:validate')
        return
    }

    modal.clear()

    const contactErrors = buyerModal.isValidContacts()

    contactsForm = new FormContacts(cloneTemplate('#contacts'), events)

    const formElement = contactsForm.render({
        ...buyerModal.getDataBayer(),
        disabled: Object.keys(contactErrors).length > 0,
        errorText: Object.values(contactErrors).join(', ')
    })

    modal.render({ content: formElement })
})

events.on('order:address-changed', (data) => {
    buyerModal.setSomeDataBuyer(data)

    const errors = buyerModal.isValidOrder()
    events.emit('order:form-update', errors)
})

events.on('order:payment-changed', (data) => {
    buyerModal.setSomeDataBuyer(data)

    const errors = buyerModal.isValidOrder()
    events.emit('order:form-update', errors)
})

events.on('order:form-update', () => { 
    orderForm?.render(buyerModal.getDataBayer())
})

events.on('order:email-changed', (data) => {
    buyerModal.setSomeDataBuyer(data)

    const errors = buyerModal.isValidContacts()
    events.emit('contacts:form-update', errors)
})

events.on('order:phone-changed', (data) => {
    buyerModal.setSomeDataBuyer(data)

    const errors = buyerModal.isValidContacts()
    events.emit('contacts:form-update', errors)
})

events.on('contacts:form-update', (errors) => {
    if (!contactsForm) return

    contactsForm.render({
        ...buyerModal.getDataBayer(),
        disabled: Object.keys(errors).length > 0,
        errorText: Object.values(errors).join(', ')
    })
})

events.on('order:submit', () => {
    const errors = buyerModal.isValidContacts()

    if (Object.keys(errors).length > 0) {
        events.emit('contacts:form-update', errors)
        return
    }

    events.emit('request:send')
    buyerModal.resetDataBuyer()
    events.emit('counter:change')
})

events.on('request:send', async () => {
    try {
        const dataBayer = buyerModal.getDataBayer()
        const total = basketModal.getPrice()
        const items = basketModal.getIdsProducts()

        const postData = { ...dataBayer, total, items }

        const response = await webLarekApi.postOrder(postData)

        events.emit('success:open', response)
    } catch (e) {
        console.log('Что-то пошло не так: ', e)
    }
})

events.on('success:open', (response) => {
    const orderSuccess = new OrderSuccess(ensureElement(cloneTemplate('#success')), events)
    const successElement = orderSuccess.render(response)
    modal.render({content: successElement})
    modal.open()
    basketModal.emptyBasket()
    events.emit('counter:change')
})

events.on('order-success:close', () => {
    modal.close()
})