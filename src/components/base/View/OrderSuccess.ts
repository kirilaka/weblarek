import { ensureElement } from "../../../utils/utils";
import { Component } from "../Component";
import { IEvents } from "../Events";

interface IOrderSuccess {
    total: number;
};

export class OrderSuccess extends Component<IOrderSuccess> {
    totalElement: HTMLElement;
    buttonElement: HTMLButtonElement;

    constructor(container: HTMLElement, protected events: IEvents) {
        super(container);

        this.totalElement = ensureElement<HTMLElement>('.order-success__description', this.container);
        this.buttonElement = ensureElement<HTMLButtonElement>('.order-success__close', this.container);

        this.buttonElement.addEventListener('click', () => {
            this.events.emit('order-success:close');
        });
    };

    set total(value: number) {
        this.totalElement.textContent = `Списано ${value} синапсов`;
    };
};