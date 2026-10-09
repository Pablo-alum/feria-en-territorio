
<template>
  <section id="categories" ref="sectionRef" class="categories section">
    <div class="container">
      <div class="section-heading">
        <span class="eyebrow">Descubrí</span>
        <h2>Explorá nuestro territorio</h2>
        <p>Productos, creaciones y propuestas de nuestra comunidad.</p>
      </div>

      <Transition name="category-page" mode="out-in">
        <div
          :key="currentPage"
          class="category-carousel"
          :class="`category-carousel--${itemsPerPage}`"
          @mouseenter="isHovered = true; syncAutoplay()"
          @mouseleave="isHovered = false; syncAutoplay()"
          @focusin="hasFocus = true; syncAutoplay()"
          @focusout="handleFocusOut"
        >
          <a
            v-for="(category, index) in visibleCategories"
            :key="category.id"
            :href="`/categorias?categoria=${category.catalogId}`"
            class="category-card"
          >
            <div class="category-image">
              <img
                v-if="category.image"
                :src="category.image"
                :alt="category.imageAlt || category.title"
                loading="lazy"
              />
              <span v-else class="category-image-placeholder">
                {{ category.title }}
              </span>
            </div>

            <div class="category-content">
              <span class="category-eyebrow">
                {{ category.eyebrow }}
              </span>

              <h3>{{ category.title }}</h3>
              <p>{{ category.description }}</p>

              <div class="category-tags">
                <span
                  v-for="item in category.items"
                  :key="item"
                  class="category-tag"
                >
                  {{ item }}
                </span>
              </div>
            </div>
          </a>
        </div>
      </Transition>

      <div v-if="pageCount > 1" class="carousel-controls">
        <button
          type="button"
          class="carousel-button"
          aria-label="Página anterior"
          @click="previousSection"
        >
          <span aria-hidden="true">←</span>
        </button>

        <div class="carousel-pagination" aria-label="Seleccionar página">
          <button
            v-for="page in pages"
            :key="page"
            type="button"
            class="pagination-dot"
            :class="{ 'pagination-dot--active': currentPage === page }"
            :aria-label="`Mostrar página ${page + 1}`"
            :aria-current="currentPage === page ? 'true' : undefined"
            @click="selectSection(page)"
          />
        </div>

        <button
          type="button"
          class="carousel-button"
          aria-label="Página siguiente"
          @click="nextSection"
        >
          <span aria-hidden="true">→</span>
        </button>
      </div>
    </div>
  </section>
</template>

<script setup>
import {
  computed,
  onMounted,
  onUnmounted,
  ref,
  watch,
} from 'vue'

const categories = [
  {
    id: 'productos',
    catalogId: 'naturales',
    eyebrow: 'Sabores y naturaleza',
    title: 'Productos naturales',
    description:
      'Alimentos y productos elaborados con dedicación, ingredientes naturales y saberes locales.',
    image: '/img/categorias/productos.jpg',
    imageAlt: 'Productos naturales de la feria',
    color: 'var(--color-primary)',
  },
  {
    id: 'creaciones',
    catalogId: 'artesanias',
    eyebrow: 'Oficios y creatividad',
    title: 'Artesanías y arte',
    description:
      'Creaciones originales que expresan la identidad, la creatividad y el trabajo artesanal del territorio.',
    image: '/img/categorias/artesanias.jpg',
    imageAlt: 'Artesanías y creaciones de integrantes de la feria',
    color: 'var(--color-accent)',
  },
  {
    id: 'cosmeticos',
    catalogId: 'naturales',
    eyebrow: 'Belleza y naturaleza',
    title: 'Cosméticos naturales',
    description:
      'Productos naturales elaborados para el cuidado personal y el bienestar.',
    image: '/img/categorias/comsetico.jpg',
    imageAlt: 'Cosméticos naturales de la feria',
    color: 'var(--color-surface)',
  },
  {
    id: 'servicios',
    catalogId: 'servicios',
    eyebrow: 'Conexiones locales',
    title: 'Servicios del territorio',
    description:
      'Personas, emprendimientos y propuestas que comparten sus conocimientos y fortalecen la comunidad.',
    image: '/img/categorias/productos.jpg',
    imageAlt: 'Servicios y emprendimientos de la comunidad',
    color: 'var(--color-surface)',
  },
]

const sectionRef = ref(null)
const windowWidth = ref(1280)
const currentPage = ref(0)
const isInView = ref(false)
const isHovered = ref(false)
const hasFocus = ref(false)

let observer = null
let autoplayInterval = null
let resizeFrame = null
let reduceMotionQuery = null

// Cantidad de tarjetas que caben en cada tamaño de pantalla.
const itemsPerPage = computed(() => {
  if (windowWidth.value >= 1024) return 3
  if (windowWidth.value >= 600) return 2
  return 1
})

// Número de páginas según la cantidad real de secciones.
const pageCount = computed(() =>
  Math.ceil(categories.length / itemsPerPage.value)
)

const pages = computed(() =>
  Array.from({ length: pageCount.value }, (_, index) => index)
)

// No duplica tarjetas para completar espacios vacíos.
const visibleCategories = computed(() => {
  const start = currentPage.value * itemsPerPage.value

  return categories.slice(start, start + itemsPerPage.value)
})

// Destaca la tarjeta central en escritorio.
function isFeatured(index) {
  const count = visibleCategories.value.length

  if (count === 1) return true
  if (itemsPerPage.value === 3) return index === Math.floor(count / 2)

  return index === 0
}

function nextSection() {
  if (pageCount.value <= 1) return

  currentPage.value = (currentPage.value + 1) % pageCount.value
  syncAutoplay()
}

function previousSection() {
  if (pageCount.value <= 1) return

  currentPage.value =
    (currentPage.value - 1 + pageCount.value) % pageCount.value

  syncAutoplay()
}

function selectSection(page) {
  if (page < 0 || page >= pageCount.value) return

  currentPage.value = page
  syncAutoplay()
}

// Corrige la página actual cuando cambia el ancho de pantalla.
watch([itemsPerPage, pageCount], () => {
  currentPage.value = Math.min(
    currentPage.value,
    pageCount.value - 1
  )

  syncAutoplay()
})

function stopAutoplay() {
  if (autoplayInterval !== null) {
    clearInterval(autoplayInterval)
    autoplayInterval = null
  }
}

function syncAutoplay() {
  stopAutoplay()

  if (
    !isInView.value ||
    document.hidden ||
    isHovered.value ||
    hasFocus.value ||
    reduceMotionQuery?.matches ||
    pageCount.value <= 1
  ) {
    return
  }

  autoplayInterval = setInterval(() => {
    currentPage.value = (currentPage.value + 1) % pageCount.value
  }, 10000)
}

function handleFocusOut(event) {
  if (!event.currentTarget.contains(event.relatedTarget)) {
    hasFocus.value = false
    syncAutoplay()
  }
}

function handleResize() {
  if (resizeFrame !== null) {
    cancelAnimationFrame(resizeFrame)
  }

  resizeFrame = requestAnimationFrame(() => {
    windowWidth.value = window.innerWidth
    resizeFrame = null
  })
}

function handleVisibilityChange() {
  syncAutoplay()
}

function handleMotionChange() {
  syncAutoplay()
}

onMounted(() => {
  windowWidth.value = window.innerWidth

  observer = new IntersectionObserver(([entry]) => {
    isInView.value = entry.isIntersecting
    syncAutoplay()
  }, {
    threshold: 0.2,
  })

  if (sectionRef.value) {
    observer.observe(sectionRef.value)
  }

  reduceMotionQuery = window.matchMedia(
    '(prefers-reduced-motion: reduce)'
  )

  reduceMotionQuery.addEventListener('change', handleMotionChange)
  window.addEventListener('resize', handleResize, { passive: true })
  document.addEventListener('visibilitychange', handleVisibilityChange)
})

onUnmounted(() => {
  stopAutoplay()
  observer?.disconnect()

  window.removeEventListener('resize', handleResize)
  document.removeEventListener('visibilitychange', handleVisibilityChange)
  reduceMotionQuery?.removeEventListener('change', handleMotionChange)

  if (resizeFrame !== null) {
    cancelAnimationFrame(resizeFrame)
  }
})
</script>

<style scoped>
.categories {
  overflow: clip;
}

.category-carousel {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  align-items: center;
  gap: clamp(0.75rem, 2.5vw, 2rem);
  min-width: 0;
  padding: 2rem 0 1.5rem;
}

.category-card {
  display: flex;
  flex-direction: column;
  align-self: center;
  min-width: 0;
  overflow: hidden;

  color: var(--color-text);
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: 1.25rem;
  box-shadow: var(--shadow);

  opacity: 0.82;
  transform: translateY(0.35rem) scale(0.97);

  transition:
    transform 500ms cubic-bezier(0.22, 1, 0.36, 1),
    opacity 350ms ease,
    box-shadow 350ms ease;
}

.category-card--featured {
  z-index: 1;
  opacity: 1;
  transform: translateY(-0.75rem) scale(1);
}

.category-image {
  width: 100%;
  aspect-ratio: 4 / 3;
  overflow: hidden;
  background: var(--color-background);
}

.category-image img {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;

  transition: transform 650ms cubic-bezier(0.22, 1, 0.36, 1);
}

.category-card:hover .category-image img {
  transform: scale(1.04);
}

.category-image-placeholder {
  display: grid;
  place-items: center;
  width: 100%;
  height: 100%;
  padding: 1rem;
  color: var(--color-soft);
  text-align: center;
}

.category-content {
  display: flex;
  flex: 1;
  flex-direction: column;
  align-items: flex-start;
  gap: 0.7rem;
  padding: clamp(1rem, 1.8vw, 1.5rem);
}

.category-eyebrow {
  color: var(--color-primary);
  font-size: 0.72rem;
  font-weight: 700;
  letter-spacing: 0.09em;
  text-transform: uppercase;
}

.category-content h3 {
  margin: 0;
  color: var(--color-text);
  font-size: clamp(1.05rem, 1.5vw, 1.35rem);
  line-height: 1.3;
  overflow-wrap: anywhere;
}

.category-content p {
  margin: 0;
  color: var(--color-soft);
  font-size: 0.9rem;
  line-height: 1.65;
  overflow-wrap: anywhere;
}

.category-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.4rem;
  margin-top: 0.3rem;
}

.category-tag {
  max-width: 100%;
  padding: 0.35rem 0.6rem;
  color: var(--color-text);
  border: 1px solid var(--color-border);
  border-radius: 999px;
  font-size: 0.73rem;
  line-height: 1.3;
  overflow-wrap: anywhere;
}

/* Transición entre páginas completas: no crea filas adicionales. */
.category-page-enter-active,
.category-page-leave-active {
  transition:
    opacity 250ms ease,
    transform 350ms cubic-bezier(0.22, 1, 0.36, 1);
}

.category-page-enter-from {
  opacity: 0;
  transform: translateX(12px);
}

.category-page-leave-to {
  opacity: 0;
  transform: translateX(-12px);
}

/* Controles */
.carousel-controls {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1.25rem;
  margin-top: 0.75rem;
}

.carousel-button {
  display: grid;
  place-items: center;
  flex: 0 0 auto;
  width: 2.7rem;
  height: 2.7rem;
  padding: 0;

  color: var(--color-text);
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: 50%;

  font: inherit;
  font-size: 1.2rem;
  cursor: pointer;

  transition:
    background 200ms ease,
    color 200ms ease,
    transform 200ms ease;
}

.carousel-button:hover {
  background: var(--color-primary);
  color: var(--color-background);
  transform: scale(1.06);
}

.carousel-button:active {
  transform: scale(0.95);
}

.carousel-button:focus-visible,
.pagination-dot:focus-visible {
  outline: 2px solid var(--color-primary);
  outline-offset: 4px;
}

/* Indicadores */
.carousel-pagination {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.6rem;
  min-height: 2rem;
}

.pagination-dot {
  flex: 0 0 auto;
  width: 0.55rem;
  height: 0.55rem;
  padding: 0;

  border: 0;
  border-radius: 999px;
  background: var(--color-primary);
  opacity: 0.4;
  cursor: pointer;

  transition:
    width 350ms cubic-bezier(0.22, 1, 0.36, 1),
    opacity 250ms ease,
    transform 250ms ease;
}

.pagination-dot--active {
  width: 1.6rem;
  opacity: 1;
}

.pagination-dot:hover {
  opacity: 1;
  transform: scale(1.1);
}

/* Tablet */
@media (max-width: 1023px) {
  .category-carousel--2 {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 1rem;
  }

  .category-card--featured {
    transform: translateY(-0.5rem) scale(1);
  }

  .category-content {
    padding: 1rem;
  }
}

/* Celular */
@media (max-width: 599px) {
  .category-carousel--1 {
    grid-template-columns: minmax(0, 1fr);
    width: 100%;
    max-width: 400px;
    margin-inline: auto;
    padding: 0.75rem 0 1rem;
  }

  .category-carousel--1 .category-card,
  .category-carousel--1 .category-card--featured {
    width: 100%;
    transform: none;
    opacity: 1;
  }

  .category-carousel--1 .category-image {
    aspect-ratio: 16 / 10;
  }

  .category-content {
    padding: 1.1rem;
  }

  .category-content h3 {
    font-size: 1.15rem;
  }

  .category-content p {
    font-size: 0.9rem;
  }

  .carousel-controls {
    gap: 1rem;
  }

  .carousel-button {
    width: 2.5rem;
    height: 2.5rem;
  }
}

@media (prefers-reduced-motion: reduce) {
  .category-card,
  .category-image img,
  .category-page-enter-active,
  .category-page-leave-active,
  .carousel-button,
  .pagination-dot {
    transition: none !important;
  }
}
</style>
