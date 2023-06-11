if (!customElements.get('custom-product')) {
    customElements.define('custom-product', class CustomProduct extends HTMLElement {
        constructor() {
            super();
            this.cartModal = document.querySelector('cart-notification') || document.querySelector('cart-drawer');
            this.form = this.querySelector('.featured-products__form');
            this.form.addEventListener('submit', this.onFormSubmit.bind(this));
            // subscribe('cart-update',() =>{
            //    this.updateProducts()
            // })
        }

        updateProducts(){
            fetch(window.Shopify.routes.root + `?section_id=${this.dataset.sectionid}`)
                .then((res) => res.text())
                .then((data) => {
                    const html = new DOMParser().parseFromString(data, 'text/html')

                    document.querySelector(`#shopify-section-${this.dataset.sectionid} .products-row`).innerHTML
                        =
                        html.querySelector('.products-row').innerHTML
                })
                .catch(error => {
                    console.error('Error', error)
                });
        }

        onFormSubmit(event){
            event.preventDefault()
            let formData = new FormData(this.form);
            formData.append('sections', 'cart-notification-product,cart-notification-button,cart-icon-bubble')
            fetch('/cart/add.js', {
                method: 'POST',
                body: formData,
            })
                .then(response => response.json())
                .then((response) => {
                    this.cartModal.renderContents(response);
                    this.updateProducts()
                })

        }

    });
}
