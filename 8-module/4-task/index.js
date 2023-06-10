import createElement from "../../assets/lib/create-element.js";
import escapeHtml from "../../assets/lib/escape-html.js";

import Modal from "../../7-module/2-task/index.js";

export default class Cart {
  cartItems = [];

  constructor(cartIcon) {
    this.cartIcon = cartIcon;

    this.addEventListeners();
  }

  addProduct(product) {
    if (!product) {
      return;
    }
    console.log(product);
    let productCheck = this.cartItems.find(
      (item) => item.product.id === product.id
    );
    if (productCheck) {
      productCheck.count++;
    } else {
      this.cartItems.push({ product, count: 1 });
    }
    this.onProductUpdate();
  }

  updateProductCount(productId, amount) {
    let productUpdate = this.cartItems.find((item) => {
      return item.product.id === productId;
    });

    if (productUpdate) {
      productUpdate.count += amount;
    }

    const count = productUpdate.count;

    if (!count) {
      this.cartItems = this.cartItems.filter(({ count }) => count !== 0);
    }

    this.onProductUpdate(productUpdate);
  }

  isEmpty() {
    for (let cartItem of this.cartItems) {
      return false;
    }
    return true;
  }

  getTotalCount() {
    let totalCount = this.cartItems.reduce(
      (value, { product, count }) => value + count,
      0
    );
    return totalCount;
  }

  getTotalPrice() {
    let totalPrice = this.cartItems.reduce(
      (value, { product, count }) => value + count * product.price,
      0
    );
    return totalPrice;
  }

  renderProduct(product, count) {
    return createElement(`
    <div class="cart-product" data-product-id="${product.id}">
      <div class="cart-product__img">
        <img src="/assets/images/products/${product.image}" alt="product">
      </div>
      <div class="cart-product__info">
        <div class="cart-product__title">${escapeHtml(product.name)}</div>
        <div class="cart-product__price-wrap">
          <div class="cart-counter">
            <button type="button" class="cart-counter__button cart-counter__button_minus">
              <img src="/assets/images/icons/square-minus-icon.svg" alt="minus">
            </button>
            <span class="cart-counter__count">${count}</span>
            <button type="button" class="cart-counter__button cart-counter__button_plus">
              <img src="/assets/images/icons/square-plus-icon.svg" alt="plus">
            </button>
          </div>
          <div class="cart-product__price">€${(count * product.price).toFixed(
            2
          )}</div>
        </div>
      </div>
    </div>`);
  }

  renderOrderForm() {
    return createElement(`<form class="cart-form">
      <h5 class="cart-form__title">Delivery</h5>
      <div class="cart-form__group cart-form__group_row">
        <input name="name" type="text" class="cart-form__input" placeholder="Name" required value="Santa Claus">
        <input name="email" type="email" class="cart-form__input" placeholder="Email" required value="john@gmail.com">
        <input name="tel" type="tel" class="cart-form__input" placeholder="Phone" required value="+1234567">
      </div>
      <div class="cart-form__group">
        <input name="address" type="text" class="cart-form__input" placeholder="Address" required value="North, Lapland, Snow Home">
      </div>
      <div class="cart-buttons">
        <div class="cart-buttons__buttons btn-group">
          <div class="cart-buttons__info">
            <span class="cart-buttons__info-text">total</span>
            <span class="cart-buttons__info-price">€${this.getTotalPrice().toFixed(
              2
            )}</span>
          </div>
          <button type="submit" class="cart-buttons__button btn-group__button button">order</button>
        </div>
      </div>
    </form>`);
  }

  renderModal() {
    this.modal = new Modal();
    this.modal.setTitle("Your order");

    this.makeModalBody();

    this.modal.open();

    this.modal.element.addEventListener("click", this.onClick);
    let form = document.querySelector(".cart-form");

    form.addEventListener("submit", (event) => {
      event.preventDefault();
      this.onSubmit();
    });
  }

  makeModalBody() {
    this.body = document.createElement("div");

    for (const good of this.cartItems) {
      const { product, count } = good;

      this.body.append(this.renderProduct(product, count));
    }
    this.body.append(this.renderOrderForm());
    this.modal.setBody(this.body);
  }

  onClick = (event) => {
    if (event.target.closest(".cart-counter__button_plus")) {
      let increase = event.target.closest(".cart-product");
      const productId = increase.dataset.productId;
      this.updateProductCount(productId, 1);

      return;
    }
    if (event.target.closest(".cart-counter__button_minus")) {
      let decrease = event.target.closest(".cart-product");
      const productId = decrease.dataset.productId;
      this.updateProductCount(productId, -1);

      return;
    }
  };

  onProductUpdate(cartItem) {
    let modalOpen = document.querySelector(".is-modal-open");

    if (modalOpen) {
      const { product, count } = cartItem;

      let productCount = this.body.querySelector(
        `[data-product-id="${product.id}"] .cart-counter__count`
      );
      productCount.innerHTML = count;

      let productPrice = this.body.querySelector(
        `[data-product-id="${product.id}"] .cart-product__price`
      );
      productPrice.innerHTML = `€${(count * product.price).toFixed(2)}`;

      let infoPrice = this.body.querySelector(`.cart-buttons__info-price`);
      infoPrice.innerHTML = `€${this.getTotalPrice().toFixed(2)}`;

      if (!count) {
        this.body.querySelector(`[data-product-id="${product.id}"]`).remove();
      }

      if (this.isEmpty()) {
        this.modal.element.remove();
      }
    }
    this.cartIcon.update(this);
  }

  onSubmit = (event) => {
    let form = document.querySelector(".cart-form");
    let button = form.querySelector(`[ type="submit"] `);

    button.classList.add("is-loading");

    fetch("https://httpbin.org/post", {
      method: "POST",
      body: new FormData(form),
    }).then((response) => {
      if (response.status == 200) {
        this.modal.setTitle("Success!");
        this.cartItems.length = 0;
        this.cartIcon.elem.remove();
        this.body.innerHTML = `<div class="modal__body-inner">
          <p>
            Order successful! Your order is being cooked :) <br />
            We’ll notify you about delivery time shortly.<br />
            <img src="/assets/images/delivery.gif" />
          </p>
        </div>`;
      }
    });
  };

  addEventListeners() {
    this.cartIcon.elem.onclick = () => this.renderModal();
  }
}