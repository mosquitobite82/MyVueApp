<script setup lang="ts">
import { ref } from 'vue'
import { ContextMenu } from './context-menu'

interface Product {
  id: number
  name: string
  price: number
  description: string
  image: string
}

interface Props {
  product: Product
}

const props = defineProps<Props>()
const emit = defineEmits(['addToCart', 'removeFromCart', 'viewDetails'])

const contextMenuItems = [
  {
    label: 'Add to Cart',
    icon: '🛒',
    action: () => emit('addToCart', props.product),
  },
  {
    label: 'View Details',
    icon: '👁️',
    action: () => emit('viewDetails', props.product),
  },
  {
    label: 'Share',
    icon: '📤',
    action: () => {
      console.log('Share product:', props.product.name)
      // Implement share functionality
    },
  },
  {
    label: 'Add to Wishlist',
    icon: '❤️',
    action: () => {
      console.log('Added to wishlist:', props.product.name)
      // Implement wishlist functionality
    },
  },
  {
    label: 'Remove',
    icon: '🗑️',
    action: () => emit('removeFromCart', props.product),
  },
]
</script>

<template>
  <ContextMenu :menu-items="contextMenuItems">
    <div class="product-card">
      <div class="product-image-container">
        <img :src="product.image" :alt="product.name" class="product-image" />
        <div class="quick-actions">
          <button
            class="quick-action-btn"
            @click.stop="emit('addToCart', product)"
            title="Add to Cart"
          >
            🛒
          </button>
          <button
            class="quick-action-btn"
            @click.stop="emit('viewDetails', product)"
            title="View Details"
          >
            👁️
          </button>
        </div>
      </div>

      <div class="product-info">
        <h3 class="product-name">{{ product.name }}</h3>
        <p class="product-description">{{ product.description }}</p>
        <div class="product-footer">
          <span class="product-price">${{ product.price.toFixed(2) }}</span>
          <button class="add-to-cart-btn" @click.stop="emit('addToCart', product)">
            Add to Cart
          </button>
        </div>
      </div>

      <div class="context-hint">💡 Right-click for more options</div>
    </div>
  </ContextMenu>
</template>

<style scoped>
.product-card {
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  cursor: default;
  position: relative;
}

.product-card:hover {
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.15);
  transform: translateY(-4px);
}

.product-image-container {
  position: relative;
  width: 100%;
  height: 200px;
  overflow: hidden;
  background: #f5f5f5;
}

.product-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.product-card:hover .product-image {
  transform: scale(1.05);
}

.quick-actions {
  position: absolute;
  top: 10px;
  right: 10px;
  display: flex;
  gap: 8px;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.product-card:hover .quick-actions {
  opacity: 1;
}

.quick-action-btn {
  width: 36px;
  height: 36px;
  border: none;
  background: rgba(255, 255, 255, 0.95);
  border-radius: 50%;
  cursor: pointer;
  font-size: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.quick-action-btn:hover {
  transform: scale(1.1);
  background: white;
}

.product-info {
  padding: 16px;
}

.product-name {
  margin: 0 0 8px 0;
  font-size: 18px;
  font-weight: 600;
  color: #2c3e50;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.product-description {
  margin: 0 0 16px 0;
  font-size: 14px;
  color: #7f8c8d;
  line-height: 1.5;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  min-height: 42px;
}

.product-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.product-price {
  font-size: 24px;
  font-weight: 700;
  color: #27ae60;
}

.add-to-cart-btn {
  padding: 8px 16px;
  background: #3498db;
  color: white;
  border: none;
  border-radius: 6px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}

.add-to-cart-btn:hover {
  background: #2980b9;
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(52, 152, 219, 0.3);
}

.context-hint {
  position: absolute;
  bottom: 8px;
  right: 8px;
  font-size: 10px;
  color: #95a5a6;
  opacity: 0;
  transition: opacity 0.3s ease;
  pointer-events: none;
}

.product-card:hover .context-hint {
  opacity: 1;
}
</style>
