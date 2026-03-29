# Проектная работа "Веб-ларек"

Стек: HTML, SCSS, TS, Vite

Структура проекта:
- src/ — исходные файлы проекта
- src/components/ — папка с JS компонентами
- src/components/base/ — папка с базовым кодом

Важные файлы:
- index.html — HTML-файл главной страницы
- src/types/index.ts — файл с типами
- src/main.ts — точка входа приложения
- src/scss/styles.scss — корневой файл стилей
- src/utils/constants.ts — файл с константами
- src/utils/utils.ts — файл с утилитами

## Установка и запуск
Для установки и запуска проекта необходимо выполнить команды

```
npm install
npm run dev
```

или

```
yarn
yarn dev
```
## Сборка

```
npm run build
```

или

```
yarn build
```
# Интернет-магазин «Web-Larёk»
«Web-Larёk» — это интернет-магазин с товарами для веб-разработчиков, где пользователи могут просматривать товары, добавлять их в корзину и оформлять заказы. Сайт предоставляет удобный интерфейс с модальными окнами для просмотра деталей товаров, управления корзиной и выбора способа оплаты, обеспечивая полный цикл покупки с отправкой заказов на сервер.

## Архитектура приложения

Код приложения разделен на слои согласно парадигме MVP (Model-View-Presenter), которая обеспечивает четкое разделение ответственности между классами слоев Model и View. Каждый слой несет свой смысл и ответственность:

Model - слой данных, отвечает за хранение и изменение данных.  
View - слой представления, отвечает за отображение данных на странице.  
Presenter - презентер содержит основную логику приложения и  отвечает за связь представления и данных.

Взаимодействие между классами обеспечивается использованием событийно-ориентированного подхода. Модели и Представления генерируют события при изменении данных или взаимодействии пользователя с приложением, а Презентер обрабатывает эти события используя методы как Моделей, так и Представлений.

### Базовый код

#### Класс Component
Является базовым классом для всех компонентов интерфейса.
Класс является дженериком и принимает в переменной `T` тип данных, которые могут быть переданы в метод `render` для отображения.

Конструктор:  
`constructor(container: HTMLElement)` - принимает ссылку на DOM элемент за отображение, которого он отвечает.

Поля класса:  
`container: HTMLElement` - поле для хранения корневого DOM элемента компонента.

Методы класса:  
`render(data?: Partial<T>): HTMLElement` - Главный метод класса. Он принимает данные, которые необходимо отобразить в интерфейсе, записывает эти данные в поля класса и возвращает ссылку на DOM-элемент. Предполагается, что в классах, которые будут наследоваться от `Component` будут реализованы сеттеры для полей с данными, которые будут вызываться в момент вызова `render` и записывать данные в необходимые DOM элементы.  
`setImage(element: HTMLImageElement, src: string, alt?: string): void` - утилитарный метод для модификации DOM-элементов `<img>`


#### Класс Api
Содержит в себе базовую логику отправки запросов.

Конструктор:  
`constructor(baseUrl: string, options: RequestInit = {})` - В конструктор передается базовый адрес сервера и опциональный объект с заголовками запросов.

Поля класса:  
`baseUrl: string` - базовый адрес сервера  
`options: RequestInit` - объект с заголовками, которые будут использованы для запросов.

Методы:  
`get(uri: string): Promise<object>` - выполняет GET запрос на переданный в параметрах ендпоинт и возвращает промис с объектом, которым ответил сервер  
`post(uri: string, data: object, method: ApiPostMethods = 'POST'): Promise<object>` - принимает объект с данными, которые будут переданы в JSON в теле запроса, и отправляет эти данные на ендпоинт переданный как параметр при вызове метода. По умолчанию выполняется `POST` запрос, но метод запроса может быть переопределен заданием третьего параметра при вызове.  
`handleResponse(response: Response): Promise<object>` - защищенный метод проверяющий ответ сервера на корректность и возвращающий объект с данными полученный от сервера или отклоненный промис, в случае некорректных данных.

#### Класс EventEmitter
Брокер событий реализует паттерн "Наблюдатель", позволяющий отправлять события и подписываться на события, происходящие в системе. Класс используется для связи слоя данных и представления.

Конструктор класса не принимает параметров.

Поля класса:  
`_events: Map<string | RegExp, Set<Function>>)` -  хранит коллекцию подписок на события. Ключи коллекции - названия событий или регулярное выражение, значения - коллекция функций обработчиков, которые будут вызваны при срабатывании события.

Методы класса:  
`on<T extends object>(event: EventName, callback: (data: T) => void): void` - подписка на событие, принимает название события и функцию обработчик.  
`emit<T extends object>(event: string, data?: T): void` - инициализация события. При вызове события в метод передается название события и объект с данными, который будет использован как аргумент для вызова обработчика.  
`trigger<T extends object>(event: string, context?: Partial<T>): (data: T) => void` - возвращает функцию, при вызове которой инициализируется требуемое в параметрах событие с передачей в него данных из второго параметра.

##### Данные 

###### Интерфейс IApi
Описывает базовую логику выполнения HTTP-запросов.

Методы:
`get<T>(uri: string): Promise<T>` — выполняет GET запрос и возвращает данные в виде `Promise<T>`.

`post<T>(uri: string, data: object, method?: ApiPostMethods): Promise<T>` — выполняет POST запрос (или другой метод, если указан) и возвращает ответ сервера.

###### Интерфейс IProduct
Описывает структуру товара.

Поля:
`id` — уникальный идентификатор товара.
`description` — описание товара.
`image` — ссылка на изображение.
`title` — название товара.
`category` — категория товара.
`price` — цена товара (null, если товар недоступен или бесплатный).

###### Интерфейс IBuyer
Описывает данные покупателя.

Поля:
`payment` — способ оплаты.
`email` — email покупателя.
`phone` — номер телефона.
`address` — адрес доставки.

###### Интерфейс IGetProductsResponse
Ответ сервера при получении списка товаров.

Поля:
`items` — массив товаров.
`total` — общее количество товаров.

###### Интерфейс IPostOrderResponse
Ответ сервера после создания заказа.

Поля:
`id` — уникальный идентификатор заказа.
`total` — итоговая сумма подтверждённого заказа.

###### Интерфейс IPostOrderRequest
Тело запроса при создании заказа.

Поля:
Наследует все поля `IBuyer`
`total` — итоговая сумма заказа
`items` — массив id товаров

###### Модели данных

###### Класс ProductCatalog
хранит массив всех товаров и товар, выбранный для подробного отображения.

Поля класса:
`arrayItems: IProduct[]` - хранит массив всех товаров.
`selectedItem: IProduct | null` - хранит товар, выбранный для подробного отображения.

содержит методы:
`setArrayItems(array: IProduct[]): void` - сохранение массива товаров полученного в параметрах метода.
`getArrayItems(): IProduct[] | null` - получение массива товаров из модели.
`getItemById(id: string): IProduct | undefined` - получение одного товара по его id.
`setItemForDisplay(id: string): void` - сохранение товара для подробного отображения.
`getItemForDisplay(): IProduct | null` - получение товара для подробного отображения.

###### Класс Basket
хранит массив товаров, выбранных покупателем для покупки.

Поля класса:
`arrayProduct: IProduct[]` - .

методы:
`getProducts(): IProduct[]` - получение массива товаров, которые находятся в корзине.
`addProduct(product: IProduct): void` - добавление товара, который был получен в параметре, в массив корзины.
`deleteProduct(product: IProduct): void` - удаление товара, полученного в параметре из массива корзины.
`emptyBasket(): void` - очистка корзины.
`getPrice(): number` - получение стоимости всех товаров в корзине.
`getTotalProducts(): number` - получение количества товаров в корзине.
`isProductById(id: string): boolean` - проверка наличия товара в корзине по его id, полученного в параметр метода.
`getIdsProducts(): string[]` - получение id всех товаров из корзины.

###### Класс Buyer
хранит данные данные покупателя.

Поля класса:
`dataBayer: IBuyer` -  хранит обьект данных покупателя: email, способ оплаты, номер телефона, адрес.

методы:
`setSomeDataBuyer(data: Partial<IBuyer>): void` - сохранение данных в модели.
`getDataBayer(): IBuyer` - получение всех данных покупателя.
`resetDataBuyer(): void` - очистка данных покупателя.
`isValid(): Partial<IBuyer> & {payment?: string}` - валидация данных. Поле является валидным, если оно не пустое. Метод даeт возможность определить не только валидность каждого отдельного поля, но и предоставлять информацию об ошибке, связанной с проверкой конкретного значения. Возвращает обьект с ошибками.

###### Класс WebLarekApi
Содержит в себе методы для удобного исполльзования запросов

Конструктор:
`constructor(api: IApi)` - в конструктор передается базовая логика отправки запросов.

Поля класса:
`api: IApi` - базовая логи отправки запросов.

Методы:
`getProducts(): Promise<IGetProductsResponse>` - выполняет GET запрос и позвращает промис масива.
`postOrder(data: IPostOrderRequest): Promise<IPostOrderResponse>` - выполняет POST запрос на переданный в параметрах обект и возвращает промис обекта с сервера.

###### Классы представления

###### Класс Basket
Отвечает за отображение корзины товаров.

конструктор:
`constructor(container: HTMLElement, protected events: IEvents)` - принимает корневой DOM элемент и объект EventEmitter для подписки и эмита событий

Поля класса:
`containerElement: HTMLElement` — контейнер списка товаров
`buttonElement: HTMLButtonElement` — кнопка оформления заказа
`totalElement: HTMLElement` — элемент отображения общей стоимости

Методы:
`set basketList(items: HTMLElement[]): void` — отображает список товаров в корзине
`set total(value: number): void` — устанавливает общую стоимость товаров
`disabled(value: number): void` — блокирует кнопку оформления, если корзина пуста

События:
`form:open` — открытие формы оформления заказа

###### Абстрактный класс Card
Базовый класс для карточек товаров.

конструктор:
`constructor(container: HTMLElement)` - принимает корневой DOM элемент

Поля класса:
`titleElement: HTMLElement` — элемент заголовка
`priceElement: HTMLElement` — элемент цены

Методы:
`set title(value: string): void` — устанавливает название товара
`set price(value: number | null): void` — отображает цену или "Бесценно", если цена отсутствует

###### Класс CardCatalog
Карточка товара в каталоге.

конструктор:
`constructor(container: HTMLElement, actions?: IActions)` - принимает корневой DOM элемент и обьект с колбеком onClick

Поля класса:
`categoryElement: HTMLElement` — элемент категории
`imageElement: HTMLImageElement` — изображение товара

Методы:
`set category(value: string): void` — устанавливает категорию и соответствующий CSS-класс
`set image(value: string): void` — устанавливает изображение

События:
`onClick` — выбор товара для просмотра

###### Класс CardPreview
Карточка подробного просмотра товара (в модальном окне).

конструктор:
`constructor(container: HTMLElement, protected events: IEvents)` - принимает корневой DOM элемент и объект EventEmitter для подписки и эмита событий

Поля класса:
`descriptionElement: HTMLElement` — описание товара
`buttonElement: HTMLButtonElement` — кнопка добавления в корзину
`categoryElement: HTMLElement` — категория
`imageElement: HTMLImageElement` — изображение

Методы:
`set description(value: string): void` — устанавливает описание
`set category(value: string): void` — устанавливает категорию
`set image(value: string): void` — устанавливает изображение
`setButtonText(value: number | null): void` — управляет состоянием кнопки (disabled и текст)
`InBasket(): void` — меняет текст кнопки на "Удалить из корзины"
`noInBasket(): void` — меняет текст кнопки на "В корзину"

События:
`preview:toggle` — добавление/удаление товара из корзины

###### Класс CardBasket
Карточка товара в корзине.

конструктор:
`constructor(container: HTMLElement, actions?: IActions)` - принимает корневой DOM элемент и обьект с колбеком onClick

Поля класса:
`buttonBasketElement: HTMLButtonElement` — кнопка удаления товара
`indexElement: HTMLElement` — порядковый номер товара

Методы:
`set index(value: number): void` — устанавливает номер товара в списке

События:
`onClick` — удаление товара из корзины

###### Абстрактный класс Form
Базовый класс для форм.

конструктор:
`constructor(container: HTMLElement, protected events: IEvents)` - принимает корневой DOM элемент и объект EventEmitter для подписки и эмита событий

Поля класса:
`submitButtonElement: HTMLButtonElement` — кнопка отправки формы
`errorElement: HTMLElement` — элемент отображения ошибок

Методы:
`set errorText(value: string): void` — отображает текст ошибки
`set disabled(value: boolean): void` — управляет доступностью кнопки отправки

###### Класс FormOrder
Форма выбора способа оплаты и адреса доставки.

конструктор:
`constructor(container: HTMLElement, protected events: IEvents)` - принимает корневой DOM элемент и объект EventEmitter для подписки и эмита событий

Поля класса:
`cardButtonElement: HTMLButtonElement` — кнопка оплаты онлайн
`cashButtonElement: HTMLButtonElement` — кнопка оплаты при получении
`addressElement: HTMLInputElement` — поле ввода адреса

Методы:
`set payment(value: TPayment): void` — устанавливает выбранный способ оплаты
`set address(value: string): void` — устанавливает адрес

События:
`order:payment-changed` — изменение способа оплаты
`order:address-changed` — изменение адреса
`order:next-form` — переход к следующему шагу

###### Класс FormContacts
Форма ввода контактных данных.

конструктор:
`constructor(container: HTMLElement, protected events: IEvents)` - принимает корневой DOM элемент и объект EventEmitter для подписки и эмита событий

Поля класса:
`emailElement: HTMLInputElement` — поле email
`phoneElement: HTMLInputElement` — поле телефона

Методы:
`set email(value: string): void` — устанавливает email
`set phone(value: string): void` — устанавливает телефон

События:
`order:email-changed` — изменение email
`order:phone-changed` — изменение телефона
`order:submit` — отправка заказа

###### Класс Gallery
Отвечает за отображение списка товаров.

конструктор:
`constructor(container: HTMLElement)` - принимает корневой DOM элемент

Методы:
`set catalog(items: HTMLElement[]): void` — отображает карточки товаров

###### Класс Header
Отвечает за отображение шапки сайта.

конструктор:
`constructor(container: HTMLElement, protected events: IEvents)` - принимает корневой DOM элемент и объект EventEmitter для подписки и эмита событий

Поля класса:
`counterElement: HTMLElement` — счетчик товаров в корзине
`buttonBasketElement: HTMLButtonElement` — кнопка открытия корзины

Методы:
`set counter(value: number): void` — обновляет количество товаров

События:
`basket:open` — открытие корзины

###### Класс Modal
Отвечает за отображение модальных окон.

конструктор:
`constructor(container: HTMLElement, protected events: IEvents)` - принимает корневой DOM элемент и объект EventEmitter для подписки и эмита событий

Поля класса:
`closeButtonElement: HTMLButtonElement` — кнопка закрытия
`modalContainer: HTMLElement` — контейнер контента

Методы:
`set content(value: HTMLElement): void` — устанавливает содержимое
`clear(): void` — очищает содержимое
`open(): void` — открывает модальное окно
`close(): void` — закрывает модальное окно

Обрабатывает:

клик по кнопке закрытия

клик по оверлею

нажатие Escape

###### Класс OrderSuccess
Отображает сообщение об успешном оформлении заказа.

конструктор:
`constructor(container: HTMLElement, protected events: IEvents)` - принимает корневой DOM элемент и объект EventEmitter для подписки и эмита событий

Поля класса:
`totalElement: HTMLElement` — отображение суммы заказа
`buttonElement: HTMLButtonElement` — кнопка закрытия

Методы:
`set total(value: number): void` — отображает итоговую сумму

События:
`order-success:close` — закрытие окна успешного заказа