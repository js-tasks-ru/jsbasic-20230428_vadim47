import createElement from '../../assets/lib/create-element.js';

export default class StepSlider {
  constructor({ steps, value = 0 }) {
    this.steps = steps;
    this.value = value;
    this.elem = this.#render();
    this.elem.addEventListener('click', this.#onClick);
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
}
