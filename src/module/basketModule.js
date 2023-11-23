const basketItems = {};
const basketCount = document.querySelector('.header-basket_count');
// Функция для обновления количества книг в корзине и видимости .basket_count
export function updateBasketCount() {
    const itemCount = Object.keys(basketItems).length;
    basketCount.textContent = itemCount;

    // Обновляем видимость .basket_count
    if (itemCount > 0) {
        basketCount.style.display = 'block'; // Показываем .basket_count при наличии товаров
    } else {
        basketCount.style.display = 'none'; // Скрываем .basket_count при пустой корзине
    }
}
// Функция для добавления книги в корзину
export function addCardToBasket(book, buttonBuy) {
    const bookCard = buttonBuy.closest('.book-card');
    const title = bookCard.querySelector('.title').textContent;

    if (basketItems[title]) {
        // Если книга уже в корзине, убираем ее
        delete basketItems[title];
        buttonBuy.textContent = 'buy now';
    } else {
        // Если книги нет в корзине, добавляем ее
        basketItems[title] = book;
        buttonBuy.textContent = 'in the cart';
    }

    // Обновляем количество книг в корзине
    updateBasketCount();
}