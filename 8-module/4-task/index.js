import createElement from '../../assets/lib/create-element.js';
import escapeHtml from '../../assets/lib/escape-html.js';

import Modal from '../../7-module/2-task/index.js';

export default class Cart {
  cartItems = []; // [product: {...}, count: N]
  constructor(cartIcon) {
    this.cartIcon = cartIcon;

    this.addEventListeners();
  }

  addProduct(product) {
    if (!product) {
      return;
    }

    let cartItem = this.cartItems.find(
      item => item.product.id === product.id
    );

    if (!cartItem) {
      cartItem = {
        product,
        count: 1
      };
      this.cartItems.push(cartItem);
    } else {
      cartItem.count++;
    }

    this.onProductUpdate(cartItem);
  }

  updateProductCount(productId, amount) {
    let cartItem = this.cartItems.find((cart) => cart.product.id == productId);
    cartItem.count += amount;
    if (cartItem.count == 0) {
      this.cartItems.splice(this.cartItems.indexOf(cartItem), 1);
    }
    this.onProductUpdate(cartItem);
  }

  isEmpty() {
    if (this.cartItems.length > 0) {
      return false;
    } else {
      return true;
    }
  }

  getTotalCount() {
    let totalCount = 0;
    this.cartItems.forEach((cartItem) => {
      totalCount += cartItem.count;
    });
    return totalCount;
  }

  getTotalPrice() {
    let totalPrice = 0;
    this.cartItems.forEach((cartItem) => {
      totalPrice += cartItem.product.price * cartItem.count;
    });
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
          <div class="cart-product__price">€${product.price.toFixed(2)}</div>
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
    let div = document.createElement("div");
    this.cartItems.forEach((cartItem) => {
      div.append(this.renderProduct(cartItem.product, cartItem.count));
    });
    div.append(this.renderOrderForm());

    this.modal.setBody(div);

    div.querySelectorAll(".cart-counter__button_minus").forEach((cart) => {
      cart.addEventListener("click", () => {
        let id = cart.closest(".cart-product").dataset.productId;
        this.updateProductCount(id, -1);
      });
    });
    div.querySelectorAll(".cart-counter__button_plus").forEach((cart) => {
      cart.addEventListener("click", () => {
        let id = cart.closest(".cart-product").dataset.productId;
        this.updateProductCount(id, 1);
      });
    });
    div.querySelector("form").onsubmit = this.onSubmit;

    this.modal.open();

    }

  onProductUpdate(cartItem) {
    if (document.body.classList.contains("is-modal-open")) {
      if (this.cartItems.length != 0) {
        let productId = cartItem.product.id; // Уникальный идентификатора товара (для примера)
        let modalBody = document.querySelector(".modal");

        // Элемент, который хранит количество товаров с таким productId в корзине
        let productCount = modalBody.querySelector(
          `[data-product-id="${productId}"] .cart-counter__count`
        );

        // Элемент с общей стоимостью всех единиц этого товара
        let productPrice = modalBody.querySelector(
          `[data-product-id="${productId}"] .cart-product__price`
        );

        // Элемент с суммарной стоимостью всех товаров
        let infoPrice = modalBody.querySelector(`.cart-buttons__info-price`);

        if (cartItem.count == 0) {
          modalBody.querySelector(`[data-product-id="${productId}"]`).remove();
        } else {
          productCount.innerHTML = cartItem.count;
          productPrice.innerHTML = `€${(
            cartItem.count * cartItem.product.price
          ).toFixed(2)}`;
        }

        infoPrice.innerHTML = `€${this.getTotalPrice().toFixed(2)}`;
      } else {
        this.modal.close();
      }
    }

    this.cartIcon.update(this);
    
  }

  onSubmit = (event) => {
    event.preventDefault();
    document.querySelector('button[type="submit"]').classList.add("is-loading");

    let form = document.querySelector(".cart-form");

    let userFormData = new FormData(form);
    fetch("https://httpbin.org/post", {
      method: "POST",
      body: userFormData
    });

    this.modal.setTitle("Success!");
    this.cartItems = [];
    this.modal.setBody(createElement(`<div class="modal__body-inner">
                          <p>
                            Order successful! Your order is being cooked :) <br>
                            We’ll notify you about delivery time shortly.<br>
                            <img src="/assets/images/delivery.gif">
                          </p>
                        </div>`));
  }

  addEventListeners() {
    this.cartIcon.elem.onclick = () => this.renderModal();
  }
};
