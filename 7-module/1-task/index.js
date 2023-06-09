import createElement from '../../assets/lib/create-element.js';

export default class RibbonMenu {
  elem = null;
  #categories = [];
  constructor(categories) {
    this.#categories = categories;
    this.elem = this.#render();
   }

  #render() {
    const container = createElement(
    `
    <div class="ribbon">
      <button class="ribbon__arrow ribbon__arrow_left ribbon__arrow_visible">
        <img src="/assets/images/icons/angle-icon.svg" alt="icon">
      </button>
      <nav class="ribbon__inner">
      </nav>
      <button class="ribbon__arrow ribbon__arrow_right">
        <img src="/assets/images/icons/angle-icon.svg" alt="icon">
      </button>
    </div>
    `
    );
    let menu = this.#categories.map(item => createElement(`
    <a href="#" class="ribbon__item" data-id="${item.id}">${item.name}</a>`));
    container.querySelector(`.ribbon__inner`).append(...menu);
    container.querySelector('.ribbon__item').classList.add('ribbon__item_active');
    container.querySelector('.ribbon__inner').addEventListener('scroll', this.#onScroll);
    container.addEventListener('click', this.#onClick);

    return container;
  }

  #onClick = (event) => {
    const ribbon = event.currentTarget;
    const ribbonInner = ribbon.querySelector('.ribbon__inner');
    const arrowRight = event.target.closest('.ribbon__arrow_right');
    const arrowLeft = event.target.closest('.ribbon__arrow_left');
    const ribonItem = event.target.closest('.ribbon__item');
    if (ribonItem) {
      event.preventDefault();
      const active = ribbon.querySelector('.ribbon__item_active');
      active.classList.remove('ribbon__item_active');
      ribonItem.classList.add('ribbon__item_active');
      ribonItem.dispatchEvent(
        new CustomEvent("ribbon-select", {
          detail: ribonItem.dataset.id,
          bubbles: true,
        })
      );
    }
    if (arrowRight) {
      ribbonInner.scrollBy(350, 0);
    };
    if (arrowLeft) {
      ribbonInner.scrollBy(-350, 0);
    };

  }

  #onScroll = (event) => {
    const ribbon = event.target.closest('.ribbon');
    const arrowRight = ribbon.querySelector('.ribbon__arrow_right');
    const arrowLeft = ribbon.querySelector('.ribbon__arrow_left');
    const scrollLeft = event.target.scrollLeft;
    const clientWidth = event.target.clientWidth;
    const scrollWidth = event.target.scrollWidth;
    const scrollRight = scrollWidth - scrollLeft - clientWidth;
   scrollLeft == 0 ? arrowLeft.classList.remove('ribbon__arrow_visible') : arrowLeft.classList.add('ribbon__arrow_visible')
    scrollRight < 1 ? arrowRight.classList.remove('ribbon__arrow_visible') : arrowRight.classList.add('ribbon__arrow_visible')

  }
}
