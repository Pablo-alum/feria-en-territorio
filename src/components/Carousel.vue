
<template>
  <section class="gallery section">

    <div class="container">

      <!-- Section heading -->

      <div class="section-heading">

        <span class="eyebrow">
          Nuestro territorio
        </span>

        <h2>
          Un lugar hecho por su gente
        </h2>

        <p>
          Conocé el espacio donde sucede nuestra feria
          y las personas que forman parte de ella.
        </p>

      </div>


      <!-- Main gallery -->

      <div
        class="gallery-main"
        aria-live="polite"
        aria-label="Galería de imágenes"
      >

        <Transition name="gallery-fade">

          
        <img
          :key="currentImage"
          :src="images[currentImage].src"
          :alt="images[currentImage].alt"
          class="gallery-image"
          @click="nextImage"
          role="button"
          tabindex="0"
          @keydown.enter="nextImage"
          @keydown.space.prevent="nextImage"
          aria-label="Mostrar siguiente imagen"
        />
        </Transition>

      </div>


      <!-- Gallery indicators -->

      <div
        class="gallery-indicators"
        aria-label="Navegación de la galería"
      >

        <button
          v-for="(image, index) in images"
          :key="image.src"
          type="button"
          class="indicator"
          :class="{
            active: index === currentImage
          }"
          :aria-label="`Mostrar imagen ${index + 1}`"
          :aria-current="
            index === currentImage
              ? 'true'
              : undefined
          "
          @click="selectImage(index)"
        />

      </div>

    </div>

  </section>
</template>


<script setup>
import {
  onMounted,
  onUnmounted,
  ref,
} from 'vue'


/*
 * Gallery images
 *
 * Replace these paths with your real images.
 */

const images = [
  {
    src: '../../public/img/comun a-3.jpg.jpeg',
    alt: 'Vista de la feria en el territorio',
  },

  {
    src: '../../public/img/feria.jpg',
    alt: 'Personas participando de la feria',
  },

  {
    src: '../../public/img/feria1.jpg',
    alt: 'Productos y espacios de la feria',
  },
]


/*
 * Current image
 */

const currentImage = ref(0)


/*
 * Automatic transition
 *
 * 15 seconds
 */

const INTERVAL_TIME = 6000

let intervalId = null


/*
 * Go to next image
 */

const nextImage = () => {

  currentImage.value =
    (currentImage.value + 1) % images.length
}


/*
 * Select specific image
 */

const selectImage = (index) => {

  currentImage.value = index

  /*
   * Restart the timer so the user gets
   * a full 15 seconds after interacting.
   */

  restartTimer()
}


/*
 * Start automatic timer
 */

const startTimer = () => {

  intervalId = setInterval(
    nextImage,
    INTERVAL_TIME
  )
}


/*
 * Restart automatic timer
 */

const restartTimer = () => {

  if (intervalId) {
    clearInterval(intervalId)
  }

  startTimer()
}


/*
 * Lifecycle
 */

onMounted(() => {
  startTimer()
})


onUnmounted(() => {

  if (intervalId) {
    clearInterval(intervalId)
  }

})
</script>
<style scoped>
/* ============================================================
   Gallery
   ============================================================ */

.gallery-main {
  position: relative;

  width: 100%;
  overflow: hidden;

  border-radius: 1.5rem;

  aspect-ratio: 16 / 9;
}


.gallery-image {
  position: absolute;
  inset: 0;

  width: 100%;
  height: 100%;

  object-fit: cover;
}


/* ============================================================
   Image transition
   ============================================================ */

.gallery-fade-enter-active,
.gallery-fade-leave-active {
  transition: opacity 500ms ease;
}


.gallery-fade-enter-from,
.gallery-fade-leave-to {
  opacity: 0;
}


/* ============================================================
   Indicators
   ============================================================ */

.gallery-indicators {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 0.5rem;

  margin-top: 1.25rem;
}


.gallery-indicators .indicator {
  width: 0.5rem;
  height: 0.5rem;

  padding: 0;

  border: 0;
  border-radius: 999px;

  background: var(--color-text);

  opacity: 0.3;

  cursor: pointer;

  transition:
    width 250ms ease,
    opacity 250ms ease,
    transform 250ms ease;
}


.gallery-indicators .indicator:hover {
  opacity: 0.6;
}


.gallery-indicators .indicator.active {
  width: 1.5rem;
  opacity: 1;
}


.gallery-indicators .indicator:focus-visible {
  outline: 2px solid var(--color-text);
  outline-offset: 4px;
}

</style>
