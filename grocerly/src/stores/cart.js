import { defineStore } from 'pinia'

export const useCartStore = defineStore('cart', {
    state: () => ({
        isOpen: false,
        items: []
    }),

    getters: {
        totalItems: (state) => {
            return state.items.reduce((sum, item) => sum + item.quantity, 0)
        },
        totalPrice: (state) => {
            return state.items.reduce((sum, item) => sum + (item.price * item.quantity), 0)
        }
    },

    actions: {
        toggleCart() {
            this.isOpen = !this.isOpen
        },
        openCart() {
            this.isOpen = true
        },
        closeCart() {
            this.isOpen = false
        },

        addItem(product) {
            const existing = this.items.find(item => item.id === product.id)
            if (existing) {
                if (existing.quantity < existing.stock) {
                    existing.quantity++
                }
            } else {
                this.items.push({
                    id: product.id,
                    name: product.name,
                    price: product.price,
                    quantity: 1,
                    image: product.image,
                    stock: product.stock
                })
            }
        },

        removeItem(id) {
            const index = this.items.findIndex(item => item.id === id)
            if (index > -1) {
                this.items.splice(index, 1)
            }
        },

        increaseQuantity(id) {
            const item = this.items.find(item => item.id === id)
            if (item && item.quantity < item.stock) {
                item.quantity++
            }
        },

        decreaseQuantity(id) {
            const item = this.items.find(item => item.id === id)
            if (item && item.quantity > 1) {
                item.quantity--
            } else if (item && item.quantity === 1) {
                this.removeItem(id)
            }
        },

        clearCart() {
            this.items = []
        },

        async submitOrder() {
            const orderData = {
                items: this.items.map(item => ({
                    productId: item.id,
                    quantity: item.quantity,
                    price: item.price
                })),
                totalPrice: this.totalPrice
            }
            console.log('Order data:', orderData)
            return orderData
        }
    }
})