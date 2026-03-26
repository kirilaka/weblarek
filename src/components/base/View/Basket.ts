import { IActions } from "../../../types";
import { ensureElement } from "../../../utils/utils";
import { Component } from "../Component";
import { IEvents } from "../Events";

export interface IBasket {
    total: number;
    basketList: HTMLElement[];
}

export class Basket extends Component<IBasket> {
    containerElement: HTMLElement;
    buttonElement: HTMLButtonElement;
    totalElement:HTMLElement;

    constructor(container: HTMLElement, protected events: IEvents, actions?: IActions) {
        super(container);

        this.containerElement = ensureElement<HTMLElement>('.basket__list', this.container);
        this.buttonElement = ensureElement<HTMLButtonElement>('.basket__button', this.container);
        this.totalElement = ensureElement<HTMLElement>('.basket__price', this.container);

        this.buttonElement.addEventListener('click', () => {
            actions?.onClick()
        });
    };

    set basketList(items: HTMLElement[]) {
        this.containerElement.replaceChildren(...items)

    }

    set total(value: number) {
        this.totalElement.textContent = `${value} синапсов`

        this.buttonElement.disabled = value === 0
    }
};