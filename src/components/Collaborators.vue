
<template>
  <section id="collaborators" class="collaborators section">
    <div class="container">
      <div class="section-heading">
        <span class="eyebrow">Nuestra comunidad</span>
        <h2>Nuestros colaboradores</h2>
        <p>
          Personas y emprendimientos que forman parte de Feria en Territorio.
        </p>
      </div>

      <div class="collaborator-grid">
        <article
          v-for="collaborator in visibleCollaborators"
          :key="collaborator.id"
          class="collaborator-card"
        >
          <div class="collaborator-image image-placeholder">
            <img
              v-if="collaborator.image"
              :src="collaborator.image"
              :alt="`Productos de ${collaborator.name}`"
              loading="lazy"
            />
            <span v-else>Imagen</span>
          </div>

          <div class="collaborator-content">
            <h3>{{ collaborator.name }}</h3>

            <span class="collaborator-category">
              {{ collaborator.category }}
            </span>

            <p>{{ collaborator.description }}</p>

            <a
              v-if="collaborator.url"
              :href="collaborator.url"
              class="text-link"
              target="_blank"
              rel="noopener noreferrer"
            >
              Ver perfil →
            </a>
          </div>
        </article>
      </div>

      <div
        v-if="totalPages > 1"
        class="collaborator-controls"
        aria-label="Navegación de colaboradores"
      >
        <button
          type="button"
          class="collaborator-button"
          :disabled="isFirstPage"
          aria-label="Colaboradores anteriores"
          @click="previousPage"
        >
          ←
        </button>

        <span class="collaborator-page" aria-live="polite">
          {{ currentPage + 1 }} / {{ totalPages }}
        </span>

        <button
          type="button"
          class="collaborator-button"
          :disabled="isLastPage"
          aria-label="Colaboradores siguientes"
          @click="nextPage"
        >
          →
        </button>
      </div>
    </div>
  </section>
</template>

<script setup>
import { computed, onMounted, onUnmounted, ref, watch } from 'vue'

const collaborators = ref([
  {
    id: 1,
    name: 'Emprendimiento Uno',
    category: 'Productos naturales',
    description: 'Productos naturales elaborados localmente.',
    image: '',
    url: '',
  },
  {
    id: 2,
    name: 'Emprendimiento Dos',
    category: 'Artesanías',
    description: 'Creaciones artesanales hechas a mano.',
    image: '',
    url: '',
  },
  {
    id: 3,
    name: 'Emprendimiento Tres',
    category: 'Alimentos',
    description: 'Alimentos elaborados artesanalmente.',
    image: '',
    url: '',
  },
  {
    id: 4,
    name: 'Emprendimiento Cuatro',
    category: 'Productos locales',
    description: 'Productos de nuestra comunidad.',
    image: '',
    url: '',
  },
  {
    id: 5,
    name: 'Emprendimiento Cinco',
    category: 'Cosmética natural',
    description: 'Productos para el cuidado personal.',
    image: '',
    url: '',
  },
  {
    id: 6,
    name: 'Emprendimiento Seis',
    category: 'Arte',
    description: 'Arte y creatividad del territorio.',
    image: '',
    url: '',
  },
])

const windowWidth = ref(
  typeof window !== 'undefined' ? window.innerWidth : 1280
)

const currentPage = ref(0)

const itemsPerPage = computed(() => {
  if (windowWidth.value >= 1024) return 5
  if (windowWidth.value >= 768) return 4
  if (windowWidth.value >= 480) return 3
  return 2
})

const totalPages = computed(() =>
  Math.ceil(collaborators.value.length / itemsPerPage.value)
)

const visibleCollaborators = computed(() => {
  const start = currentPage.value * itemsPerPage.value
  return collaborators.value.slice(start, start + itemsPerPage.value)
})

const isFirstPage = computed(() => currentPage.value === 0)

const isLastPage = computed(() =>
  currentPage.value >= totalPages.value - 1
)

function previousPage() {
  if (!isFirstPage.value) currentPage.value--
}

function nextPage() {
  if (!isLastPage.value) currentPage.value++
}

// Keep pagination valid when the viewport or data changes.
watch(
  [itemsPerPage, totalPages],
  () => {
    currentPage.value = Math.min(
      currentPage.value,
      Math.max(totalPages.value - 1, 0)
    )
  }
)

function handleResize() {
  windowWidth.value = window.innerWidth
}

onMounted(() => {
  handleResize()
  window.addEventListener('resize', handleResize, { passive: true })
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
})
</script>

<style scoped>
/* Grid */

.collaborator-grid {
  display: grid;
  grid-template-columns: repeat(5, minmax(0, 1fr));
  align-items: stretch;
  gap: clamp(0.75rem, 1.5vw, 1.25rem);
}

.collaborator-card {
  display: flex;
  flex-direction: column;
  min-width: 0;
  overflow: hidden;
  border-radius: 1rem;
  transition: transform 250ms ease, box-shadow 250ms ease;
}

@media (hover: hover) {
  .collaborator-card:hover {
    transform: translateY(-4px);
  }
}

/* Images */

.collaborator-image {
  position: relative;
  width: 100%;
  aspect-ratio: 4 / 3;
  overflow: hidden;
}

.collaborator-image img {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.collaborator-image span {
  font-size: 0.85rem;
}

/* Content */

.collaborator-content {
  display: flex;
  flex: 1;
  flex-direction: column;
  align-items: flex-start;
  gap: 0.5rem;
  min-width: 0;
  padding: clamp(0.65rem, 1.2vw, 1rem);
}

.collaborator-content h3 {
  margin: 0;
  font-size: clamp(0.85rem, 1.1vw, 1rem);
  line-height: 1.35;
  overflow-wrap: anywhere;
}

.collaborator-category {
  display: block;
  max-width: 100%;
  color: var(--color-primary);
  font-size: 0.8rem;
  line-height: 1.4;
  overflow-wrap: anywhere;
}

.collaborator-content p {
  margin: 0;
  font-size: 0.85rem;
  line-height: 1.55;
  overflow-wrap: anywhere;
}

.collaborator-content .text-link {
  margin-top: auto;
  padding-top: 0.65rem;
  font-size: 0.85rem;
}

/* Pagination */

.collaborator-controls {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  margin-top: 2rem;
}

.collaborator-button {
  display: grid;
  place-items: center;
  width: 2.4rem;
  height: 2.4rem;
  padding: 0;
  border: 1px solid var(--color-border);
  border-radius: 50%;
  background: var(--color-surface);
  color: var(--color-text);
  cursor: pointer;
  transition: background 200ms ease, transform 200ms ease, opacity 200ms ease;
}

.collaborator-button:hover:not(:disabled) {
  transform: translateY(-2px);
}

.collaborator-button:disabled {
  opacity: 0.35;
  cursor: not-allowed;
}

.collaborator-page {
  font-size: 0.85rem;
  font-variant-numeric: tabular-nums;
}

/* Tablet: 4 columns */

@media (max-width: 1023px) {
  .collaborator-grid {
    grid-template-columns: repeat(4, minmax(0, 1fr));
    gap: 1rem;
  }

  .collaborator-content {
    padding: 0.8rem;
  }
}

/* Large phones: 3 columns */

@media (max-width: 767px) {
  .collaborator-grid {
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 0.75rem;
  }

  .collaborator-card {
    border-radius: 0.85rem;
  }

  .collaborator-content {
    gap: 0.4rem;
    padding: 0.65rem;
  }

  .collaborator-content h3 {
    font-size: 0.85rem;
  }

  .collaborator-category,
  .collaborator-content p,
  .collaborator-content .text-link {
    font-size: 0.75rem;
  }
}

/* Small phones: 2 columns */

@media (max-width: 479px) {
  .collaborator-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 0.85rem;
  }

  .collaborator-card {
    border-radius: 0.9rem;
  }

  .collaborator-content {
    padding: 0.75rem;
    gap: 0.45rem;
  }

  .collaborator-content h3 {
    font-size: 0.9rem;
  }

  .collaborator-category,
  .collaborator-content p,
  .collaborator-content .text-link {
    font-size: 0.78rem;
  }

  .collaborator-controls {
    margin-top: 1.5rem;
  }
}

/* Very narrow screens */

@media (max-width: 340px) {
  .collaborator-grid {
    gap: 0.6rem;
  }

  .collaborator-content {
    padding: 0.55rem;
  }

  .collaborator-content h3 {
    font-size: 0.82rem;
  }

  .collaborator-category,
  .collaborator-content p,
  .collaborator-content .text-link {
    font-size: 0.72rem;
  }
}

/* Respect reduced-motion preferences */

@media (prefers-reduced-motion: reduce) {
  .collaborator-card,
  .collaborator-button {
    transition: none;
  }
}
</style>
