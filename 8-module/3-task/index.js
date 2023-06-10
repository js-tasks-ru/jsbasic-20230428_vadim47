export default class Cart {
  cartItems = []; // [product: {...}, count: N]

  constructor(cartIcon) {
    this.cartIcon = cartIcon;
  }

  addProduct(product) {
    if (!product) {
      return;
    }
    let productCheck = this.cartItems.find((item) => {
      return item.product.id === product.id;
    });
    if (productCheck) {
      productCheck.count++;
    } else {
      this.cartItems.push({ product, count: 1 });
    }
    this.onProductUpdate(this.cartItem);
  }

  updateProductCount(productId, amount) {
    let productUpdate = this.cartItems.find((item) => {
      return item.product.id === productId;
    });
    if (productUpdate) {
      productUpdate.count += amount;
    }
    let productDelete = this.cartItems.findIndex((item) => item.count < 1);
    if (productDelete > -1) {
      this.cartItems.splice(productDelete, 1);
    }
    this.onProductUpdate(this.cartItem);
  }

  isEmpty() {
    for (let key of this.cartItems) {
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

  onProductUpdate(cartItem) {
    // реализуем в следующей задаче

    this.cartIcon.update(this);
  }
}