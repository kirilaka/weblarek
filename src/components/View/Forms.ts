import { TPayment } from "../../types";
import { ensureElement } from "../../utils/utils";
import { Component } from "../base/Component";
import { IEvents } from "../base/Events";

export interface IForm {
    errorText: string;
    disabled: boolean;
}

export interface IFormOrder {
    payment: TPayment;
    address: string;
}

export interface IFormContacts {
    email: string;
    phone: string;
}

export abstract class Form<T> extends Component<T & IForm> {
    submitButtonElement: HTMLButtonElement;
    errorElement: HTMLElement;

    constructor(container: HTMLElement, protected events: IEvents) {
        super(container);

        this.submitButtonElement = ensureElement<HTMLButtonElement>('button[type="submit"]', this.container);
        this.errorElement = ensureElement<HTMLElement>('.form__errors', this.container);
    }

    set errorText(value: string) {
        this.errorElement.textContent = value
    }

    set disabled(value: boolean) {
        this.submitButtonElement.disabled = value;
    }
}

export class FormOrder extends Form<IFormOrder> {
    cardButtonElement: HTMLButtonElement;
    cashButtonElement: HTMLButtonElement;
    addressElement: HTMLInputElement;

    constructor(container: HTMLElement, protected events: IEvents) {
        super(container, events);

        this.cardButtonElement = ensureElement<HTMLButtonElement>('button[name="card"]', this.container);
        this.cashButtonElement = ensureElement<HTMLButtonElement>('button[name="cash"]', this.container);
        this.addressElement = ensureElement<HTMLInputElement>('input[name="address"]', this.container);

        this.cardButtonElement.addEventListener('click', () => {
            this.events.emit('order:payment-changed', {payment: 'online'});
        });

        this.cashButtonElement.addEventListener('click', () => {
            this.events.emit('order:payment-changed', {payment: 'offline'});
        });

        this.addressElement.addEventListener('input', () => {
            this.events.emit('order:address-changed', {address: this.addressElement.value})})

        this.container.addEventListener('submit', (e) => {
            e.preventDefault()
            this.events.emit('order:next-form');
        });
    };

    set payment(value: TPayment) {
        this.cardButtonElement.classList.toggle('button_alt-active', value === 'online');
        this.cashButtonElement.classList.toggle('button_alt-active', value === 'offline');
    };

    set address(value: string) {
        this.addressElement.value = value;
    };
}

export class FormContacts extends Form<IFormContacts> {
    emailElement: HTMLInputElement;
    phoneElement: HTMLInputElement;

    constructor(container: HTMLElement, protected events: IEvents) {
        super(container, events);

        this.emailElement = ensureElement<HTMLInputElement>('input[name="email"]', this.container);
        this.phoneElement = ensureElement<HTMLInputElement>('input[name="phone"]', this.container);

        this.emailElement.addEventListener('input', () => {
            this.events.emit('order:email-changed', {email: this.emailElement.value})
        });

        this.phoneElement.addEventListener('input', () => {
            this.events.emit('order:phone-changed', {phone: this.phoneElement.value})
        });

        this.container.addEventListener('submit', (e) => {
            e.preventDefault()
            this.events.emit('order:submit');
        });
    };

    set email(value: string) {
        this.emailElement.value = value;
    };

    set phone(value: string) {
        this.phoneElement.value = value;
    };
}