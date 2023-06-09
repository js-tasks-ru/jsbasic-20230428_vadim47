import createElement from '../../assets/lib/create-element.js';
import ProductCard from '../../6-module/2-task/index.js';

export default class ProductGrid {
  elem = null;
  constructor(products) {
    this.products = products;
    this.filters = {};
    this.elem = this.#render();
    this.#filterCards();

  }

  #render() {
    return createElement(
      `
      <div class="products-grid">
        <div class="products-grid__inner">
        </div>
      </div>
      `);
    }

  #filterCards() {
    let filteredProducts = this.products;
      for(const [key, value] of Object.entries(this.filters)) {
        if (key === 'noNuts' && value === true) {
          filteredProducts = filteredProducts.filter((item) => item['nuts'] !== value);
        }
        if (key === 'vegeterianOnly' && value === true) {
          filteredProducts = filteredProducts.filter((item) => item['vegeterian'] === value);
        }
        if (key === 'maxSpiciness') {
          filteredProducts = filteredProducts.filter((item) => item['spiciness'] <= value);
        }
        if (key === 'category' && value)  {
          filteredProducts = filteredProducts.filter((item) => item[key] === value);
        }   
    }
    const prod = this.elem.querySelector('.products-grid__inner');
    prod.innerHTML = '';
    for (const product of filteredProducts) {
      let card = new ProductCard(product);
      prod.append(card.elem);
    };

  }
  updateFilter(filters) {
    this.filters = Object.assign(this.filters, filters);
    this.#filterCards();
  }
}