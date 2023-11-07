import './scss/main.scss';
// import { loadBooks, renderBooks, loadMoreBooks } from './APIBooks.js';

const entities = [
    { mainSliderImage: './src/img/banner1.png' },
    { mainSliderImage: './src/img/banner2.png' },
    { mainSliderImage: './src/img/banner3.png' }
];


const mainSliderImage = document.querySelectorAll('.main_slider-image');
const mainSliderDots = document.querySelectorAll('.main_slider-dot');
let cards;

let currentSlide = 0;

function showSlide(index) {

    mainSliderImage.forEach((image, i) => {
        if (i === index) {
            image.style.display = 'block';
            mainSliderDots[i].classList.add('active');
        } else {
            image.style.display = 'none';
            mainSliderDots[i].classList.remove('disabled');
        }
    });

    mainSliderDots.forEach((dot, i) => {
        if (i === index) {
            dot.classList.add('disabled');
        } else {
            dot.classList.remove('disabled');
        }
    });

}

function setSliderByDot(dotIndex) {
    currentSlide = dotIndex;
    showSlide(currentSlide);
}

mainSliderDots.forEach((dot, i) => {
    dot.addEventListener('click', () => {
        setSliderByDot(i);
    });
});

function nextSlide() {
    currentSlide = (currentSlide + 1) % mainSliderImage.length;
    showSlide(currentSlide);
}

setInterval(() => {
    nextSlide()
}, 5000);

showSlide(currentSlide);




const basketItems = {};
const basketCount = document.querySelector('.basket_count'); 
// Функция для обновления количества книг в корзине и видимости .basket_count
function updateBasketCount() {
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
function addCardToBasket(book, buttonBuy) {
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


function loadBooks(category) {
    const bookContainer = document.querySelector(".section-container");
    bookContainer.innerHTML = "";

    fetch(`https://www.googleapis.com/books/v1/volumes?q=subject:${category}&key=AIzaSyAJd3kICh5o-BwHt48IcAwt9X_MWxinyR4&printType=books&startIndex=0&maxResults=6&langRestrict=en`)
        .then(response => response.json())
        .then(data => {

            console.log(data); // Добавьте эту строку для вывода ответа на консоль
            cards = data;
            if (cards.items && Array.isArray(cards.items)) {
                const bookContainer = document.querySelector(".section-container");
                bookContainer.innerHTML = ""; // Очистите содержимое контейнера перед добавлением новых карточек
                cards.items.forEach(item => {
                    const title = item.volumeInfo.title || 'Заголовок отсутствует';
                    const authors = item.volumeInfo.authors ? item.volumeInfo.authors.join(', ') : 'Автор неизвестен';
                    const thumbnail = item.volumeInfo.imageLinks ? item.volumeInfo.imageLinks.thumbnail : 'https://placebear.com/g/212/300';
                    const rating = item.volumeInfo.averageRating || 0;
                    const ratingsCount = item.volumeInfo.ratingsCount || 0;
                    const description = item.volumeInfo.description || 'Описание отсутствует';
                    const retailPrice = item.saleInfo && item.saleInfo.retailPrice ? item.saleInfo.retailPrice.amount : null;

                    const truncatedDescription = truncateDescription(description, 91);


                    const bookCard = document.createElement('div');
                    bookCard.classList.add('book-card');
                    bookCard.innerHTML = `
                        <img class="image" src="${thumbnail}" alt="${title}">
                        <div class="info-books">
                        <p class="authors">${authors}</p>
                        <h1 class="title">${title}</h1>
                        <div class="ratings-box">
                        <img class="average-rating">${rating} / 5</img>
                        <p class="ratings-count">${ratingsCount} review</p>
                        </div>
                        <p class="description">${truncatedDescription}</p>
                        ${retailPrice ? `<p class="sale-info retail-prise">$ ${retailPrice}</p>` : ''}
                        <button class="button-buy">buy now</button>
                        </div>
                    `;

                    const buttonBuy = bookCard.querySelector('.button-buy');
                    buttonBuy.addEventListener('click', () => addCardToBasket(item, buttonBuy)); // Передаем объект item и кнопку как аргументы
                
                    bookContainer.appendChild(bookCard);
                  


                    const stars = document.createElement('div');
                    stars.classList.add('stars');
                    for (let i = 1; i <= 5; i++) {
                        const star = document.createElement('img');
                        star.textContent = i <= rating ? '⭐' : '☆';
                        stars.appendChild(star);
                    }

                    bookCard.appendChild(stars);

                    bookContainer.appendChild(bookCard);
                });


            } else {
                console.error('Полученные данные некорректны или отсутствуют.');
            }
        })
        .catch(error => {
            console.error('Произошла ошибка при запросе к API:', error);
        });
}

const categories = document.querySelectorAll('.category');
const defaultCategory = categories[0]; // Первая категория по умолчанию
defaultCategory.classList.add('active-category');

categories.forEach(category => {
    category.addEventListener('click', function () {
        if (!this.classList.contains('active-category')) {
            // Убираем класс 'active-category' у текущей активной категории
            const activeCategory = document.querySelector('.category.active-category');
            if (activeCategory) {
                activeCategory.classList.remove('active-category');
            }

            // Добавляем класс 'active-category' к выбранной категории
            this.classList.add('active-category');

            const selectedCategory = this.textContent;
            loadBooks(selectedCategory);
        }
    });
});

loadBooks(categories[0].textContent);



function truncateDescription(description, maxCharacters) {
    if (description.length <= maxCharacters) {
        return description; // Если текст короче или равен максимальному количеству символов, не обрезаем его
    } else {
        return description.slice(0, maxCharacters) + '...'; // Обрезаем текст до максимального количества символов и добавляем многоточие
    }
}


