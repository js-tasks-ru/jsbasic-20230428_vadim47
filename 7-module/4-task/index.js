import createElement from '../../assets/lib/create-element.js';


export default class StepSlider {
  constructor({ steps, value = 0 }) {
    this.steps = steps;
    this.value = value;
    this.elem = this.#render();
    this.elem.addEventListener('click', this.#onClick);
    this.elem.ondragstart = (event) => {
      event.preventDefault();
    }
    this.elem.addEventListener('pointerdown', this.#onPointerDown);


  }

  #render() {
    return createElement(`
    <div class="slider">
    <!--Ползунок слайдера с активным значением-->
    <div class="slider__thumb">
      <span class="slider__value">0</span>
    </div>
    <!--Заполненная часть слайдера-->
    <div class="slider__progress" style="width: 0%;"></div>
    <!--Шаги слайдера-->
    <div class="slider__steps">
      ${this.#repeatSpans()}
    </div>
  </div>`);
  }

  #repeatSpans() {
    let spans = '<span class="slider__step-active"></span>';
    for(let i = 1; i < this.steps; i++) {
      spans += '<span></span>';
    }
    return spans;
  }

  #onClick(event) {
    const elem = event.currentTarget;
    const thumb = document.querySelector('.slider__thumb');
    const progress = document.querySelector('.slider__progress');
    let left = event.clientX - elem.getBoundingClientRect().left;
    let leftRelative = left / elem.offsetWidth;
    const sliderSteps = document.querySelector('.slider__steps');
    const steps = sliderSteps.children.length;
    let segments = steps - 1;
    let approximateValue = leftRelative * segments;
    let value = Math.round(approximateValue);
    let leftPercents = value / segments * 100;
    thumb.style.left = `${leftPercents}%`;
    progress.style.width = `${leftPercents}%`;
    //добавим значение
    const sliderValue = elem.querySelector('.slider__value');
    sliderValue.textContent = value;
    //добавим класс 
    elem.querySelector('.slider__step-active').classList.remove('slider__step-active');
    const spans = sliderSteps.querySelectorAll(`span`);
    spans[value].classList.add('slider__step-active');

    elem.dispatchEvent(
      new CustomEvent('slider-change', {
        detail: value,
        bubbles: true
      })
    );
  }
  #onPointerDown(event) {
    const elem = event.currentTarget;
    const thumb = elem.querySelector('.slider__thumb');
    const sliderSteps = elem.querySelector('.slider__steps');
    const progress = elem.querySelector('.slider__progress');
    const steps = sliderSteps.children.length;
    const segments = steps - 1;
    const sliderValue = elem.querySelector('.slider__value')

    if (event.target === thumb) {
      elem.classList.add(`slider_dragging`);
      document.addEventListener(`pointermove`, onPointerMove);
      document.addEventListener(`pointerup`, onPointerUp, { once: true });
    }
   function onPointerMove(event){
    event.preventDefault();
      const slider = document.querySelector(`.slider`);
      thumb.ondragstart = () => false;
      let left = event.clientX - elem.getBoundingClientRect().left;
      let leftRelative = left / elem.offsetWidth;

      if (leftRelative < 0) {
        leftRelative = 0;
      }

      if (leftRelative > 1) {
        leftRelative = 1;
      }

      let approximateValue = leftRelative * segments;
      let value = Math.round(approximateValue);
      let leftPercents = Math.round(leftRelative * 100);
      progress.style.width = `${leftPercents}%`;
      thumb.style.left = `${leftPercents}%`;
      sliderValue.textContent = value;
     }
     function onPointerUp(event) {
      const slider = document.querySelector('.slider');
      let left = event.clientX - slider.getBoundingClientRect().left;
      let leftRelative = left / slider.offsetWidth;

      if (leftRelative < 0) {
        leftRelative = 0;
      }

      if (leftRelative > 1) {
        leftRelative = 1;
      }

      let approximateValue = leftRelative * segments;
      let value = Math.round(approximateValue);
      sliderValue.textContent = value;

      slider.dispatchEvent(
        new CustomEvent("slider-change", {
          detail: value,
          bubbles: true,
        })
     );
     slider.classList.remove(`slider_dragging`);
     document.removeEventListener(`pointermove`, onPointerMove);
  }
}
}