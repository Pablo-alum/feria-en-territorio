<script setup>
import { ref, onMounted } from "vue";
import "../styles/global.css";

const isDark = ref(false);

onMounted(() => {
  const savedTheme = localStorage.getItem("theme");

  if (savedTheme) {
    isDark.value = savedTheme === "dark";
  } else {
    isDark.value = window.matchMedia(
      "(prefers-color-scheme: dark)"
    ).matches;
  }

  applyTheme();
});

function applyTheme() {
  const theme = isDark.value ? "dark" : "light";

  document.documentElement.dataset.theme = theme;

  localStorage.setItem("theme", theme);
}

function toggleTheme() {
  isDark.value = !isDark.value;

  applyTheme();
}
</script>

<template>
  <button
    class="theme-toggle"
    type="button"
    @click="toggleTheme"
    :aria-label="
      isDark
        ? 'Cambiar al modo claro'
        : 'Cambiar al modo oscuro'
    "
    :aria-pressed="isDark"
  >
    <span class="theme-label" aria-hidden="true">
      {{ isDark ? "☾" : "☀" }}
    </span>

    <span class="theme-label">
      {{ isDark ? "Oscuro" : "Claro" }}
    </span>
  </button>
</template>
<style scoped>
/* =========================================
   THEME TOGGLE
========================================= */
.theme-toggle {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.45rem;

  min-height: 2.4rem;
  margin-left: 0.75rem;
  padding: 0.45rem 0.8rem;

  border: 2px solid var(--color-text);
  border-radius: 999px;

  background: transparent;
  color: var(--color-text);

  font: inherit;
  font-size: 0.8rem;
  font-weight: 700;
  cursor: pointer;
}

.theme-label {
  color: var(--color-text);
}


</style>
