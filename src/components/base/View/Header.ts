import { ensureElement } from "../../../utils/utils";
import { Component } from "../Component";
import { IEvents } from "../Events";

interface IHeader {
    counter: number;
};

export class Header extends Component<IHeader> {
    counterElement: HTMLElement;
    buttonBasketElement: HTMLButtonElement;

    constructor(container: HTMLElement, protected events: IEvents) {
        super(container);

        this.counterElement = ensureElement<HTMLElement>('.header__basket-counter', this.container);
        this.buttonBasketElement = ensureElement<HTMLButtonElement>('.header__basket', this.container);

        
        this.buttonBasketElement.addEventListener('click', () => {
            this.events.emit('basket:open');
        });
    };

    set counter(value: number) {
        this.counterElement.textContent = String(value);
    };
};