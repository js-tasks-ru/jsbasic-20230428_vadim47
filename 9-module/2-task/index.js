import Carousel from "../../6-module/3-task/index.js";
import slides from "../../6-module/3-task/slides.js";

import RibbonMenu from "../../7-module/1-task/index.js";
import categories from "../../7-module/1-task/categories.js";

import StepSlider from "../../7-module/4-task/index.js";
import ProductGrid from "../../8-module/2-task/index.js";

import CartIcon from "../../8-module/1-task/index.js";
import Cart from "../../8-module/4-task/index.js";

export default class Main {
  constructor() {}

  async render() {
    let carousel = new Carousel(slides);
    document.querySelector(`[ data-carousel-holder ] `).append(carousel.elem);

    this.ribbonMenu = new RibbonMenu(categories);
    document
      .querySelector(`[ data-ribbon-holder ] `)
      .append(this.ribbonMenu.elem);
    console.log(this.ribbonMenu.elem);

    this.stepSlider = new StepSlider({ steps: 5, value: 3 });
    document
      .querySelector(`[ data-slider-holder ] `)
      .append(this.stepSlider.elem);

    let cartIcon = new CartIcon();
    document.querySelector(`[ data-cart-icon-holder ] `).append(cartIcon.elem);

    let cart = new Cart(cartIcon);

    const products = await this.showProducts();

    let productsGrid = new ProductGrid(products, {
      maxSpiciness: this.stepSlider.value,
    });
    document
      .querySelector(`[ data-products-grid-holder ] `)
      .append(productsGrid.elem);

    this.addToCart(products, cart);

    this.filterProduct(productsGrid);
  }

  async showProducts(cart) {
    const response = await fetch("products.json");

    const products = await response.json();

    return products;
  }

  addToCart(products, cart) {
    document.body.addEventListener("product-add", (event) => {
      let productToAdd = products.find(
        (product) => product.id === event.detail
      );

      if (productToAdd) {
        cart.addProduct(productToAdd);
      }
    });
  }

  filterProduct(productsGrid) {
    this.stepSlider.elem.addEventListener("slider-change", (event) => {
      let spicinessValue = event.detail;
      productsGrid.updateFilter({ maxSpiciness: spicinessValue });
    });

    this.ribbonMenu.elem.addEventListener("ribbon-select", (event) => {
      let categoryId = event.detail;
      productsGrid.updateFilter({ category: categoryId });
    });

    let nutsCheckbox = document.getElementById("nuts-checkbox");
    nutsCheckbox.addEventListener("change", (event) => {
      productsGrid.updateFilter({ noNuts: event.target.checked });
    });

    let vegetarianCheckbox = document.getElementById("vegeterian-checkbox");
    vegetarianCheckbox.addEventListener("change", (event) => {
      productsGrid.updateFilter({ vegeterianOnly: event.target.checked });
    });
  }
}