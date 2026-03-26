import { ensureElement } from "../../../utils/utils";
import { Component } from "../Component";
import { IEvents } from "../Events";

interface IModal {
    content: HTMLElement;
    clear():void;
}

export class Modal extends Component<IModal> {
    closeButtonElement: HTMLButtonElement;
    modalContainer: HTMLElement;

    constructor(container: HTMLElement, protected events: IEvents) {
        super(container);

        this.closeButtonElement = ensureElement<HTMLButtonElement>('.modal__close', this.container);
        this.modalContainer = ensureElement<HTMLElement>('.modal__content', this.container);   
    }

    set content(value: HTMLElement) {
        this.modalContainer.replaceChildren(value)
    };

    clear() {
        this.modalContainer.replaceChildren()
    }; 

    handleClickOnCloseButton = () => { 
        this.close();
    }

    handleClickOnOverlay = (event: Event) => { 
        if (event.target === this.container) {
            this.close();
        }
    }
    
    handleEscape = (event: KeyboardEvent) => { 
        if (event.key == 'Escape') { 
            this.close();
            console.log('dasdasdsa')
        }
    }

    open() {
        this.container.classList.add('modal_active');
        this.closeButtonElement.addEventListener('click', this.handleClickOnCloseButton)
        this.container.addEventListener('click', this.handleClickOnOverlay);
        window.addEventListener('keydown', this.handleEscape);
    }

    close() {
        this.container.classList.remove('modal_active')
        this.closeButtonElement.removeEventListener('click', this.handleClickOnCloseButton)
        this.container.removeEventListener('click', this.handleClickOnOverlay);
        window.removeEventListener('keydown', this.handleEscape);
    }
}