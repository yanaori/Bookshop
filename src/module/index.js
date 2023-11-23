import '../scss/main.scss';
import { updateBasketCount } from './basketModule';
import { showSlide, setSliderByDot, nextSlide, currentSlide } from './slider';
import { categories, loadBooks, addLoadMoreHandler } from './bookLoader';

const entities = [
    { mainSliderImage: './src/img/banner1.png' },
    { mainSliderImage: './src/img/banner2.png' },
    { mainSliderImage: './src/img/banner3.png' }
];

const mainSliderImage = document.querySelectorAll('.main_slider-image');
const mainSliderDots = document.querySelectorAll('.main_slider-dot');

mainSliderDots.forEach((dot, i) => {
    dot.addEventListener('click', () =>
        setSliderByDot(i, mainSliderImage, mainSliderDots));
});

setInterval(() => {
    nextSlide(mainSliderImage, mainSliderDots);
}, 5000);

showSlide(currentSlide, mainSliderImage, mainSliderDots);
updateBasketCount();

loadBooks(categories[0].textContent);
addLoadMoreHandler(categories[0].textContent);

