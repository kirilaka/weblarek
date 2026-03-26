import { ensureElement } from "../../../utils/utils";
import { Component } from "../Component";
import { IActions } from "../../../types";
import { categoryMap } from "../../../utils/constants";

type CategoryKey = keyof typeof categoryMap;

interface ICard {
    title: string;
    price: number | null;
}

interface ICardCatalog {
    category: string;
    image: string;
}

interface ICardPreview extends ICardCatalog{
    description: string;
};

interface ICardBasket {
    index: number;
}

export abstract class Card<T> extends Component<T & ICard> {
    titleElement: HTMLElement;
    priceElement: HTMLElement;

    constructor(conteiner: HTMLElement) {
        super(conteiner)

        this.titleElement = ensureElement<HTMLElement>('.card__title', this.container);
        this.priceElement = ensureElement<HTMLElement>('.card__price', this.container);
    }

    set title(value: string) {
        this.titleElement.textContent = value;
    }

    set price(value: number | null) {
        if(value == null) {
            this.priceElement.textContent = `Бесценно`
        } else {
            this.priceElement.textContent = `${value} синапсов`;
        }
    }
}

export class CardCatalog extends Card<ICardCatalog>{
    categoryElement: HTMLElement;
    imageElement: HTMLImageElement;

    constructor(container: HTMLElement, actions?: IActions) {
        super(container);

        this.categoryElement = ensureElement<HTMLElement>('.card__category', this.container);
        this.imageElement = ensureElement<HTMLImageElement>('.card__image', this.container);

        this.container.addEventListener('click', () => {
            actions?.onClick()
        });
    }

    set category(value: string) {
        this.categoryElement.textContent = value;
        
        for (const key in categoryMap) {
        this.categoryElement.classList.toggle(
            categoryMap[key as CategoryKey],
            key === value
        );
        };
    }

    
    set image(value: string) {
        this.setImage(this.imageElement, value, this.title)
    }
}

export class CardPreview extends Card<ICardPreview> {
    descriptionElement: HTMLElement;
    buttonElement: HTMLButtonElement;
    categoryElement: HTMLElement;
    imageElement: HTMLImageElement;

    constructor(container: HTMLElement, actions?: IActions) {
        super(container);

        this.descriptionElement = ensureElement<HTMLElement>('.card__text', this.container);
        this.buttonElement = ensureElement<HTMLButtonElement>('.card__button', this.container);
        this.categoryElement = ensureElement<HTMLElement>('.card__category', this.container);
        this.imageElement = ensureElement<HTMLImageElement>('.card__image', this.container);

        if(actions?.onClick) {
            this.buttonElement.addEventListener('click', actions.onClick);
        };
    };

    set description(value: string) {
        this.descriptionElement.textContent = value;
    };

    set category(value: string) {
        this.categoryElement.textContent = value;

        for (const key in categoryMap) {
        this.categoryElement.classList.toggle(
            categoryMap[key as CategoryKey],
            key === value
        );
        };
    }

    
    set image(value: string) {
        this.setImage(this.imageElement, value, this.title)
    }

    set price(value: number | null) {
        super.price = value
        
        if (value === null) {
            this.buttonElement.disabled = true;
            this.buttonElement.textContent = 'Недоступно';
        } else {
            this.buttonElement.disabled = false;
        }
    }

    InBasket() {
        this.buttonElement.textContent = 'Удалить из корзины'
    }

    noInBasket() {
        this.buttonElement.textContent = 'В корзину'
    }
}

export class CardBasket extends Card<ICardBasket> {
    buttonBasketElement: HTMLButtonElement;
    indexElement: HTMLElement;

    constructor(container: HTMLElement, actions?: IActions) {
        super(container)

        this.buttonBasketElement = ensureElement<HTMLButtonElement>('.basket__item-delete', this.container);
        this.indexElement = ensureElement<HTMLElement>('.basket__item-index', this.container);

        if(actions?.onClick){
            this.buttonBasketElement.addEventListener('click', actions.onClick)
        }
    }

    set index(value: number) {
        this.indexElement.textContent = String(value);
    }
}