// js/carousel.js

document.addEventListener("DOMContentLoaded", () => {
    const carouselItems = document.querySelectorAll(".carousel-item");
    let currentIndex = 0;

    function showNextItem() {
        carouselItems[currentIndex].classList.remove("active");
        currentIndex = (currentIndex + 1) % carouselItems.length;
        carouselItems[currentIndex].classList.add("active");
    }

    carouselItems[currentIndex].classList.add("active");
    setInterval(showNextItem, 5000);
});