export let currentSlide = 0; 

export function showSlide(index, mainSliderImage, mainSliderDots) {
    mainSliderImage.forEach((image, i) => {
        if (i === index) {
            image.style.display = 'block';
            mainSliderDots[i].classList.add('active');
        } else {
            image.style.display = 'none';
            mainSliderDots[i].classList.remove('active');
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

export function setSliderByDot(dotIndex, mainSliderImage, mainSliderDots) {
    console.log('setSliderByDot:', mainSliderImage, mainSliderDots); 
    currentSlide = dotIndex;
    showSlide(currentSlide, mainSliderImage, mainSliderDots);
}

export function nextSlide(mainSliderImage, mainSliderDots) {
    console.log('nextSlide:', mainSliderImage, mainSliderDots); 
    currentSlide = (currentSlide + 1) % mainSliderImage.length;
    showSlide(currentSlide, mainSliderImage, mainSliderDots);
}