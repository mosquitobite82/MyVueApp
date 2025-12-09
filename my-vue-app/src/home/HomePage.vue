<script lang="ts">
import { products } from '../data/data'
import Cart from './Cart.vue'

export default {
  name: 'HomePage',
  components: {
    Cart,
  },
  created() {
    this.products = products
  },
  data() {
    return {
      products: products,
    }
  },
  methods: {
    addToCart(product: any) {},
  },
}
</script>

<template>
  <Cart />
  <!--
  <h3>Products</h3>
  <ul>
    <li v-for="product in products" :key="product.id">
      <h3>{{ product.name }}</h3>
      <p>{{ product.price }}</p>
      <p>{{ product.description }}</p>
      <img :src="product.image" :alt="product.name" width="100" height="100" />
      <button @:click="addToCart(product)">Add to Cart</button>
    </li>
  </ul> -->
</template>

<style scoped></style>
