const API = 'https://raw.githubusercontent.com/GeekBrainsTutorial/online-store-api/master/responses';

const app = new Vue({
    el: '#app',
    data: {
        catalogUrl: '/catalogData.json',
        products: [],
        filtered: [],
        cart: [],
        imgCatalog: 'https://via.placehold.com/200x150',
        userSearch: '',
        show: false,
        loading: false,
        content: false,
        isVisibleCart: false
    },
    methods: {
        getJson(url) {
            return fetch(url)
                .then(result => result.json())
                .catch(error => {
                    console.log(error);
                })
        },
        filterGoods() {
            const regexp = new RegExp(this.userSearch, 'i');
            this.filtered = this.products.filter(product => regexp.test(product.product_name));
        },
        showCart() {
            this.isVisibleCart = !this.isVisibleCart;
        },
        resetFilter() {
            if (this.userSearch === '') {
                this.filtered = this.products;
            }

        },
        addProduct(element) {
            this.getJson(`${API}/addToBasket.json`)
                .then(data => {
                        if (data.result === 1) {
                            let productId = element.id_product;
                            let find = this.cart.find(product => product.id_product === productId);
                            if (find) {
                                find.quantity++;
                            } else {
                                let product = {
                                    id_product: productId,
                                    price: +element.price,
                                    product_name: element.product_name,
                                    quantity: 1
                                };
                                this.cart = [product];
                            }
                        } else {
                            alert('Error');
                        }
                    }
                )
        },
        removeProduct(element) {
            this.getJson(`${API}/deleteFromBasket.json`)
                .then(data => {
                    if (data.result === 1) {
                        let productId = element.id_product;
                        let find = this.cart.find(product => product.id_product === productId);
                        if (find.quantity > 1) {
                            find.quantity--;
                        } else {
                            this.cart.splice(this.cart.indexOf(find), 1);
                        }
                    } else {
                        alert('Error');
                    }
                })
        },
    },
    mounted() {
        this.loading = true;
        this.getJson(`${API + this.catalogUrl}`)
            .then(data => {
                for (let el of data) {
                    el.quantity = 0;
                    this.products.push(el);
                }
                this.filtered = this.products;
                this.cart = this.products;
                if (this.filtered) {
                    this.loading = false;
                    this.content = true;
                }
            });
        // this.getJson(`getProducts.json`)
        //     .then(data => {
        //         for (let el of data) {
        //             this.products.push(el);
        //         }
        //     })

    }
})


