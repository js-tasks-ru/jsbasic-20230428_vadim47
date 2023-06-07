function initCarousel() {
  // ваш код...
  let currentNumber = 0;
  const slides = document.querySelector(".carousel__inner");
  const countSlides = slides.children.length - 1;

  const width = document.querySelector(".carousel__slide").offsetWidth;
  const arrowLeft = document.querySelector(".carousel__arrow_left");
  const arrowRight = document.querySelector(".carousel__arrow_right");
  arrowLeft.style.display = "none";

  arrowRight.onclick = function () {
    currentNumber++;
    arrowLeft.style.display = "";
    if (currentNumber === countSlides) {
      arrowRight.style.display = "none";
    }
    slides.style.transform = `translateX(-${width * currentNumber}px)`;
  }

  arrowLeft.onclick = function () {
    currentNumber--;
    arrowRight.style.display = "";
    if (!currentNumber) {
      arrowLeft.style.display = "none";
    }
    slides.style.transform = `translateX(-${width * currentNumber}px)`;
  }
}
