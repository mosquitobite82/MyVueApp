<script setup lang="ts">
import { products } from '@/data/data'
import type { Product } from '@/types'
import { onMounted, onUpdated, onActivated } from 'vue'

const items: Product[] = []
items.push(...products)

const addToCart = (item: any) => {
  items.push(item)
}
</script>

<template>
  <h3>Cart Tjooolle</h3>
  <ul>
    <li v-for="item in items" :key="item.id">
      <h4>{{ item.name }}</h4>
    </li>
  </ul>
</template>

<style scoped></style>
