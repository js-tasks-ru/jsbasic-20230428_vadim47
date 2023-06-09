import createElement from '../../assets/lib/create-element.js';

export default class Modal {
  constructor() {
    this.render();
  }
  render(){
    this.elem = createElement(`
    <div class="modal">
      <div class="modal__overlay"></div>
      <div class="modal__inner">
        <div class="modal__header">
          <button type="button" class="modal__close">
            <img src="/assets/images/icons/cross-icon.svg" alt="close-icon" />
          </button>
          <h3 class="modal__title">
            Вот сюда нужно добавлять заголовок
          </h3>
        </div>
        <div class="modal__body">
          A сюда нужно добавлять содержимое тела модального окна
        </div>
      </div>
    </div>
      `)
  }
  open(){
    let body = document.body;
    body.classList.add('is-modal-open');
    body.append(this.elem);
    this.elem.addEventListener('click', this.closeModal);
    document.addEventListener('keydown', this.keydown);
  }

  setTitle(modalTitle) {
    this.elem.querySelector('.modal__title').innerHTML = modalTitle;
  }

  setBody(node){
    let ModalBody = this.elem.querySelector('.modal__body');
    ModalBody.innerHTML ='';
    ModalBody.append(node);
    
  }

  close(){
    document.body.classList.remove('is-modal-open');
    this.elem.remove();
  }

  closeModal = (event) => {
    if (event.target.closest('.modal__close')) {
      this.close();
    }
  }

  keydown = (event) => {
    if (event.code === 'Escape') {
      this.close();
    }
}
}
