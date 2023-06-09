import createElement from "../../assets/lib/create-element.js";

export default class CartIcon {
  constructor() {
    this.render();

    this.initEventListeners();
  }

  render() {
    this.elem = createElement('<div class="cart-icon"></div>');
  }

  update(cart) {
    if (!cart.isEmpty()) {
      this.elem.classList.add("cart-icon_visible");

      this.elem.innerHTML = `
        <div class="cart-icon__inner">
          <span class="cart-icon__count">${cart.getTotalCount()}</span>
          <span class="cart-icon__price">€${cart
            .getTotalPrice()
            .toFixed(2)}</span>
        </div>`;
      this.updatePosition();
      this.elem.classList.add("shake");
      this.elem.addEventListener(
        "transitionend",
        () => {
          this.elem.classList.remove("shake");
        },
        { once: true }
      );
    } else {
      this.elem.classList.remove("cart-icon_visible");
    }
  }

  initEventListeners() {
    document.addEventListener("scroll", () => this.updatePosition());
    window.addEventListener("resize", () => this.updatePosition());
  }

  updatePosition() {
    let { top, width } = this.elem.getBoundingClientRect();

    if (window.pageYOffset > top) {
      let shiftWindow = document.documentElement.clientWidth - width - 10;

      let shiftContainer =
        document.querySelector(".container").getBoundingClientRect().right + 20;

      let shiftHorizontal = Math.min(shiftWindow, shiftContainer) + "px";

      Object.assign(this.elem.style, {
        position: "fixed",
        top: "50px",
        zIndex: 1e3,
        right: "10px",
        left: shiftHorizontal,
      });
    }
    if (window.pageYOffset < top) {
      Object.assign(this.elem.style, {
        position: "",
        top: "",
        left: "",
        zIndex: "",
      });
    }
    if (document.documentElement.clientWidth <= 767) {
      Object.assign(this.elem.style, {
        position: "",
        top: "",
        left: "",
        zIndex: "",
      });
    }
  }
}