import '../scss/main.scss';
// import { showSlide} from './slider.js';
import { updateBasketCount, addCardToBasket } from './basketModule';
import { truncateDescription } from './utils.js';
// import { loadBooks} from './APIBooksModule';
// import { loadBooks, renderBooks, loadMoreBooks } from './APIBooks.js';

const entities = [
    { mainSliderImage: './src/img/banner1.png' },
    { mainSliderImage: './src/img/banner2.png' },
    { mainSliderImage: './src/img/banner3.png' }
];

const mainSliderImage = document.querySelectorAll('.main_slider-image');
const mainSliderDots = document.querySelectorAll('.main_slider-dot');
let cards;
let loadMoreButton; 
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
updateBasketCount();

let startIndex = typeof startIndex === 'number' ? startIndex : 0;
const booksPerPage = 6;
let allBooksLoaded = false; // Флаг для отслеживания всех загруженных книг
let booksData = [];

function loadBooks(category) {
    if (allBooksLoaded) {
        // Если все книги уже загружены, выход
        return;
    }
    const sectionContainer = document.querySelector('.section-container_book');

    fetch(`https://www.googleapis.com/books/v1/volumes?q=subject:${category}&key=AIzaSyAJd3kICh5o-BwHt48IcAwt9X_MWxinyR4&printType=books&startIndex=${startIndex}&maxResults=${booksPerPage}&langRestrict=en`)
        .then(response => response.json())
        .then(data => {
            console.log(data); // Добавьте эту строку для вывода ответа на консоль
            cards = data;
            if (cards.items && Array.isArray(cards.items)) {
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
                        <div class="average-rating">
                          <div class="stars">${generateStars(rating)}</div>
                        </div>
                        <p class="ratings-count">${ratingsCount} review</p>
                        </div>
                        <p class="description">${truncatedDescription}</p>
                        ${retailPrice ? `<p class="sale-info retail-prise">$ ${retailPrice}</p>` : ''}
                        <button class="button-buy">buy now</button>
                        </div>
                    `;           
                    const buttonBuy = bookCard.querySelector('.button-buy');
                    buttonBuy.addEventListener('click', () => addCardToBasket(item, buttonBuy)); // Передаем объект item и кнопку как аргументы                  

                    function generateStars(rating) {
                        let starsHTML = '';
                        for (let i = 1; i <= 5; i++) {
                            const starHTML = `
                                <svg width="12" height="11" viewBox="0 0 12 11" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M6 0L7.80568 3.5147L11.7063 4.1459L8.92165 6.9493L9.52671 10.8541L6 9.072L2.47329 10.8541L3.07835 6.9493L0.293661 4.1459L4.19432 3.5147L6 0Z" fill="${i <= rating ? '#F2C94C' : '#EEEDF5'}"/>
                                </svg>
                            `;
                            starsHTML += starHTML;
                        }
                        return starsHTML;
                    }
                    sectionContainer.appendChild(bookCard);
                    booksData.push(item); // Добавляем данные о книге в массив
                });
                 
                startIndex += booksPerPage;// Увеличиваем индекс начала следующей порции книг
            } else {
                console.error('Полученные данные некорректны или отсутствуют.');
            }
        })
        .catch(error => {
            console.error('Произошла ошибка при запросе к API:', error);
        });
}

function addLoadMoreHandler() {
    if (!loadMoreButton) {
        // Создаем кнопку "Load more", только если она еще не была создана
        loadMoreButton = document.createElement('button');
        loadMoreButton.classList.add('books-button_more');
        loadMoreButton.innerHTML = 'Load more';

        // Получаем контейнер, в который будем добавлять кнопку
        const container = document.querySelector('.section-container');

        // Добавляем кнопку в контейнер
        container.appendChild(loadMoreButton);

        // Определяем новый обработчик клика
        const loadMoreClickHandler = () => {
            const activeCategory = document.querySelector('.category.active-category');
            const selectedCategory = activeCategory.textContent;
            loadBooks(selectedCategory);
        };
        // Добавляем обработчик клика к кнопке
        loadMoreButton.addEventListener('click', loadMoreClickHandler);
    }
}
// Используем эту функцию при инициализации страницы и при смене категории
addLoadMoreHandler();

const categories = document.querySelectorAll('.category');
const defaultCategory = categories[0]; // Первая категория по умолчанию
defaultCategory.classList.add('active-category');

categories.forEach(category => {
    category.addEventListener('click', function () {
        if (!this.classList.contains('active-category')) {
  
            const sectionContainers = document.querySelector('.section-container_book');
            // Очищаем контейнер перед загрузкой новых книг
            sectionContainers.innerHTML = '';

            // Убираем класс 'active-category' у текущей активной категории
            const activeCategory = document.querySelector('.category.active-category');
            if (activeCategory) {
                activeCategory.classList.remove('active-category');
            }
            // Добавляем класс 'active-category' к выбранной категории
            this.classList.add('active-category');
            const selectedCategory = this.textContent;
            startIndex = 0; // Сбросить startIndex при смене категории
            allBooksLoaded = false; // Сбросить флаг, так как мы загружаем новую категорию
            booksData = []; // Очищаем массив с данными о книгах
            
            loadBooks(selectedCategory);
        }
    });
});

loadBooks(categories[0].textContent);
addLoadMoreHandler(categories[0].textContent);

