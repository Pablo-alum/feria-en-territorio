<template>
  <section class="catalog section">
    <div class="container">
      <div class="catalog-filters" aria-label="Filtrar productos">
        <button
          v-for="category in categories"
          :key="category.id"
          type="button"
          class="catalog-filter"
          :class="{ 'catalog-filter--active': activeCategory === category.id }"
          :aria-pressed="activeCategory === category.id"
          @click="activeCategory = category.id"
        >
          {{ category.label }}
          <span class="filter-count">
            {{ countFor(category.id) }}
          </span>
        </button>
      </div>

      <div class="catalog-heading">
        <div>
          <span class="eyebrow">{{ selectedCategory.eyebrow }}</span>
          <h2>{{ selectedCategory.label }}</h2>
          <p>{{ selectedCategory.description }}</p>
        </div>

        <span class="catalog-total">
          {{ filteredProducts.length }}
          {{ filteredProducts.length === 1 ? 'resultado' : 'resultados' }}
        </span>
      </div>

        <TransitionGroup
          v-if="filteredProducts.length"
          name="product"
          tag="div"
          class="product-grid"
        >
          <a
            v-for="product in filteredProducts"
            :key="product.id"
            :href="product.contactUrl || 'https://www.instagram.com/cocacolaar/'"
            class="product-card"
            target="_blank"
            rel="noopener noreferrer"
          >
            <div class="product-image">
              <img
                v-if="product.image"
                :src="product.image"
                :alt="product.imageAlt || product.name"
                loading="lazy"
              />
              <span v-else class="product-placeholder">
                {{ product.name }}
              </span>
            </div>
        
            <div class="product-info">
              <span class="product-category">
                {{ categoryLabel(product.category) }}
              </span>
        
              <h3>{{ product.name }}</h3>
              <p>{{ product.description }}</p>
        
              <div class="product-footer">
                <span v-if="product.price" class="product-price">
                  {{ product.price }}
                </span>
        
                <span class="product-link">
                  Consultar <span aria-hidden="true">↗</span>
                </span>
              </div>
            </div>
          </a>
        </TransitionGroup>
      <div v-else class="catalog-empty">
        <h3>Todavía no hay publicaciones en esta categoría</h3>
        <p>Pronto vas a encontrar nuevas propuestas de la comunidad.</p>
        <button
          type="button"
          class="catalog-reset"
          @click="activeCategory = 'todos'"
        >
          Ver todos
        </button>
      </div>
    </div>
  </section>
</template>

<script setup>
import { computed, ref, onMounted } from 'vue'

const categories = [
  {
    id: 'todos',
    label: 'Todos',
    eyebrow: 'Descubrí la feria',
    description: 'Todas las propuestas disponibles en un solo lugar.',
  },
  {
    id: 'naturales',
    label: 'Productos naturales',
    eyebrow: 'Naturaleza y bienestar',
    description: 'Alimentos, cosmética y productos de elaboración natural.',
  },
  {
    id: 'artesanias',
    label: 'Artesanías y arte',
    eyebrow: 'Creatividad local',
    description: 'Objetos, obras y creaciones hechas por integrantes de la feria.',
  },
  {
    id: 'servicios',
    label: 'Servicios',
    eyebrow: 'Personas y comunidad',
    description: 'Servicios, conocimientos y propuestas del territorio.',
  },
]

const products = ref([
  // PRODUCTOS NATURALES
  {
    id: 1,
    name: 'Cosmética de la Tierra',
    category: 'naturales',
    description: 'Cremas, aceites y preparados naturales para el cuidado de la piel.',
    image: '/img/comsetico.jpg',
    imageAlt: 'Productos de cosmética natural',
    price: '',
    contactUrl: 'https://www.instagram.com/cocacolaar/',
  },
  {
    id: 2,
    name: 'Sabores del Monte',
    category: 'naturales',
    description: 'Alimentos artesanales inspirados en los sabores y frutos de nuestra tierra.',
    image: '',
    imageAlt: 'Alimentos artesanales',
    price: '',
    contactUrl: 'https://www.instagram.com/cocacolaar/',
  },
  {
    id: 3,
    name: 'Semillas y Raíces',
    category: 'naturales',
    description: 'Hierbas, semillas y propuestas para conectar con una vida más natural.',
    image: '',
    imageAlt: 'Semillas y hierbas naturales',
    price: '',
    contactUrl: 'https://www.instagram.com/cocacolaar/',
  },

  // ARTESANÍAS Y ARTE
  {
    id: 4,
    name: 'Manos de la Tierra',
    category: 'artesanias',
    description: 'Piezas artesanales hechas a mano, con materiales y técnicas tradicionales.',
    image: '',
    imageAlt: 'Artesanías hechas a mano',
    price: '',
    contactUrl: 'https://www.instagram.com/cocacolaar/',
  },
  {
    id: 5,
    name: 'Trazos del Territorio',
    category: 'artesanias',
    description: 'Ilustraciones, obras y creaciones artísticas con identidad local.',
    image: '',
    imageAlt: 'Obras artísticas locales',
    price: '',
    contactUrl: 'https://www.instagram.com/cocacolaar/',
  },
  {
    id: 6,
    name: 'Barro y Raíces',
    category: 'artesanias',
    description: 'Objetos decorativos y piezas únicas inspiradas en la naturaleza.',
    image: '',
    imageAlt: 'Objetos artesanales decorativos',
    price: '',
    contactUrl: 'https://www.instagram.com/cocacolaar/',
  },

  // SERVICIOS
  {
    id: 7,
    name: 'Bienestar Natural',
    category: 'servicios',
    description: 'Propuestas de bienestar integral para cuidar el cuerpo y encontrar equilibrio.',
    image: '',
    imageAlt: 'Servicios de bienestar',
    price: '',
    contactUrl: 'https://www.instagram.com/cocacolaar/',
  },
  {
    id: 8,
    name: 'Saberes Compartidos',
    category: 'servicios',
    description: 'Talleres y experiencias para aprender, crear y compartir conocimientos.',
    image: '',
    imageAlt: 'Talleres y actividades comunitarias',
    price: '',
    contactUrl: 'https://www.instagram.com/cocacolaar/',
  },
  {
    id: 9,
    name: 'Conexión Local',
    category: 'servicios',
    description: 'Emprendimientos y servicios que acompañan las necesidades de la comunidad.',
    image: '',
    imageAlt: 'Emprendimientos y servicios locales',
    price: '',
    contactUrl: 'https://www.instagram.com/cocacolaar/',
  },
])
const activeCategory = ref('todos')
onMounted(() => {
  const params = new URLSearchParams(window.location.search)
  const categoryFromUrl = params.get('categoria')

  const exists = categories.some(
    (category) => category.id === categoryFromUrl
  )

  if (exists) {
    activeCategory.value = categoryFromUrl
  }
})
const selectedCategory = computed(() =>
  categories.find((category) => category.id === activeCategory.value)
  || categories[0]
)

const filteredProducts = computed(() => {
  if (activeCategory.value === 'todos') return products.value

  return products.value.filter(
    (product) => product.category === activeCategory.value
  )
})

function countFor(categoryId) {
  if (categoryId === 'todos') return products.value.length

  return products.value.filter(
    (product) => product.category === categoryId
  ).length
}

function categoryLabel(categoryId) {
  return categories.find((category) => category.id === categoryId)?.label
    || 'Otros'
}
</script>

<style scoped>
.catalog-filters {
  display: flex;
  flex-wrap: wrap;
  gap: 0.65rem;
  margin-bottom: clamp(2rem, 5vw, 3.5rem);
}

.catalog-filter {
  display: inline-flex;
  align-items: center;
  gap: 0.6rem;
  max-width: 100%;
  padding: 0.7rem 1rem;
  color: var(--color-text);
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: 999px;
  font: inherit;
  font-size: 0.9rem;
  cursor: pointer;
  transition:
    background 200ms ease,
    color 200ms ease,
    border-color 200ms ease;
}

.catalog-filter:hover {
  border-color: var(--color-primary);
}

.catalog-filter--active {
  color: var(--color-background);
  background: var(--color-primary);
  border-color: var(--color-primary);
}

.filter-count {
  display: grid;
  place-items: center;
  min-width: 1.35rem;
  height: 1.35rem;
  padding-inline: 0.25rem;
  border-radius: 999px;
  background: rgb(127 127 127 / 14%);
  font-size: 0.75rem;
}

.catalog-heading {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.catalog-heading h2 {
  margin: 0.4rem 0;
  color: var(--color-text);
  font-size: clamp(1.5rem, 3vw, 2.25rem);
}

.catalog-heading p {
  max-width: 650px;
  margin: 0;
  color: var(--color-soft);
  line-height: 1.65;
}

.catalog-total {
  flex-shrink: 0;
  color: var(--color-soft);
  font-size: 0.85rem;
}

.product-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  align-items: stretch;
  gap: 1.5rem;
}

.product-card {
  min-width: 0;
  overflow: hidden;
  background: var(--color-primary);
  color: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: 1.2rem;
  box-shadow: var(--shadow);
  transition:
    transform 300ms ease,
    opacity 250ms ease,
    border-color 250ms ease;
}

.product-card:hover {
  transform: translateY(-4px);
  border-color: var(--color-primary);
}

.product-image {
  width: 100%;
  aspect-ratio: 4 / 3;
  overflow: hidden;
  background: var(--color-background);
}

.product-image img {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.product-placeholder {
  display: grid;
  place-items: center;
  width: 100%;
  height: 100%;
  padding: 1rem;
  color: var(--color-soft);
  text-align: center;
}

.product-info {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 0.7rem;
  padding: 1.2rem;
  height: calc(100% - 0px);
}

.product-category {
  color: var(--color-primary);
  font-size: 0.72rem;
  font-weight: 700;
  letter-spacing: 0.04em;
}

.product-info h3 {
  margin: 0;
  font-size: 1.15rem;
  line-height: 1.35;
  overflow-wrap: anywhere;
}

.product-info p {
  margin: 0;
  color: var(--color-soft);
  font-size: 0.9rem;
  line-height: 1.65;
}

.product-footer {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
  width: 100%;
  margin-top: auto;
  padding-top: 0.8rem;
}

.product-price {
  font-weight: 700;
}

.product-link {
  color: var(--color-primary);
  font-weight: 700;
  font-size: 0.9rem;
  text-decoration: none;
}

.product-link:hover {
  text-decoration: underline;
}

.catalog-empty {
  padding: 3rem 1rem;
  text-align: center;
  border: 1px dashed var(--color-border);
  border-radius: 1rem;
}

.catalog-empty h3 {
  color: var(--color-text);
}

.catalog-empty p {
  color: var(--color-soft);
}

.catalog-reset {
  padding: 0.65rem 1rem;
  color: var(--color-background);
  background: var(--color-primary);
  border: 0;
  border-radius: 999px;
  font: inherit;
  cursor: pointer;
}

.product-enter-active,
.product-leave-active,
.product-move {
  transition:
    opacity 250ms ease,
    transform 300ms ease;
}

.product-enter-from,
.product-leave-to {
  opacity: 0;
  transform: translateY(10px);
}

.product-leave-active {
  position: absolute;
}

@media (max-width: 900px) {
  .product-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 1rem;
  }
}

@media (max-width: 600px) {
  .catalog-filters {
    gap: 0.5rem;
  }

  .catalog-filter {
    padding: 0.6rem 0.8rem;
    font-size: 0.82rem;
  }

  .catalog-heading {
    align-items: flex-start;
    flex-direction: column;
  }

  .product-grid {
    grid-template-columns: minmax(0, 1fr);
  }

  .product-card {
    display: grid;
    grid-template-columns: 38% minmax(0, 1fr);
  }

  .product-image {
    height: 100%;
    min-height: 160px;
    aspect-ratio: auto;
  }

  .product-info {
    padding: 0.85rem;
    gap: 0.5rem;
  }

  .product-info h3 {
    font-size: 1rem;
  }

  .product-info p {
    font-size: 0.82rem;
  }

  .product-tag {
    overflow-wrap: anywhere;
  }
}

@media (prefers-reduced-motion: reduce) {
  .product-card,
  .product-enter-active,
  .product-leave-active,
  .product-move {
    transition: none;
  }
}
</style>
