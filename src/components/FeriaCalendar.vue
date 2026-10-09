
<script setup>
import { computed, ref } from 'vue'

const today = new Date()

const displayedDate = ref(
  new Date(today.getFullYear(), today.getMonth(), 1)
)

const participants = [
  {
    id: 1,
    name: 'Raíces Naturales',
    category: 'Cosmética natural',
    initials: 'RN',
  },
  {
    id: 2,
    name: 'Tierra Viva',
    category: 'Cerámica y artesanías',
    initials: 'TV',
  },
  {
    id: 3,
    name: 'Sabores del Monte',
    category: 'Alimentos regionales',
    initials: 'SM',
  },
  {
    id: 4,
    name: 'Manos de la Tierra',
    category: 'Diseño independiente',
    initials: 'MT',
  },
]

const weekdays = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom']

const monthName = computed(() =>
  new Intl.DateTimeFormat('es-AR', {
    month: 'long',
    year: 'numeric',
  }).format(displayedDate.value)
)

const calendarCells = computed(() => {
  const year = displayedDate.value.getFullYear()
  const month = displayedDate.value.getMonth()

  // JavaScript starts weeks on Sunday; the calendar starts on Monday.
  const offset = (new Date(year, month, 1).getDay() + 6) % 7
  const daysInMonth = new Date(year, month + 1, 0).getDate()

  return [
    ...Array(offset).fill(null),
    ...Array.from({ length: daysInMonth }, (_, index) => index + 1),
  ]
})

function changeMonth(amount) {
  const date = displayedDate.value

  displayedDate.value = new Date(
    date.getFullYear(),
    date.getMonth() + amount,
    1
  )
}

function isToday(day) {
  const date = displayedDate.value

  return (
    day === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear()
  )
}

function addToGoogleCalendar() {
  const date = displayedDate.value

  // Provisional event details
  const eventDate = `${date.getFullYear()}${String(
    date.getMonth() + 1
  ).padStart(2, '0')}11`

  const params = new URLSearchParams({
    action: 'TEMPLATE',
    text: 'Feria en Territorio',
    dates: `${eventDate}/${eventDate}`,
    details: 'Encuentro de la Feria en Territorio.',
    location: 'Por confirmar',
  })

  window.open(
    `https://calendar.google.com/calendar/render?${params.toString()}`,
    '_blank',
    'noopener,noreferrer'
  )
}
</script>

<template>
  <section id="calendar" class="feria-calendar section">
    <header class="feria-calendar__intro">
      <span class="eyebrow">Agendá la fecha</span>
      <h2>Nos encontramos en la feria</h2>
      <p>
        Descubrí proyectos locales, conocé a sus creadores
        y compartí lo que nace en nuestro territorio.
      </p>
    </header>

    <div class="feria-calendar__layout">
      <!-- Main calendar -->
      <article class="calendar-card">
        <header class="calendar-header">
          <div>
            <span class="calendar-kicker">Próximo encuentro</span>
            <h3>{{ monthName }}</h3>
          </div>

          <div class="calendar-navigation">
            <button
              type="button"
              class="calendar-nav-button"
              aria-label="Mes anterior"
              @click="changeMonth(-1)"
            >
              ‹
            </button>

            <button
              type="button"
              class="calendar-nav-button"
              aria-label="Mes siguiente"
              @click="changeMonth(1)"
            >
              ›
            </button>
          </div>
        </header>

        <div class="calendar-grid">
          <span
            v-for="weekday in weekdays"
            :key="weekday"
            class="calendar-weekday"
          >
            {{ weekday }}
          </span>

          
    <button
      v-for="(day, index) in calendarCells"
      :key="`day-${index}`"
      type="button"
      class="calendar-cell"
      :class="{
        'calendar-cell--empty': day === null,
        'calendar-day--event': day === 11,
        'calendar-day--today': day !== null && isToday(day),
      }"
      :disabled="day === null"
      :aria-label="
        day === 11
          ? `${day}, agregar Feria en Territorio a Google Calendar`
          : day !== null
            ? `Día ${day}`
            : undefined
      "
      @click="day === 11 && addToGoogleCalendar()"
    >
      <span v-if="day !== null" class="calendar-day-number">
        {{ day }}
      </span>
    
      <span v-if="day === 11" class="calendar-event-dot"></span>
    </button>
        </div>

        <footer class="calendar-footer">
          <div class="calendar-legend">
            <span class="calendar-legend-circle"></span>
            <span>Día de feria</span>
          </div>

          <p>Nos encontramos cada día 11</p>
        </footer>
      </article>

      <!-- Compact participant list -->
      <aside class="participants-card">
        <header class="participants-header">
          <div>
            <span class="calendar-kicker">Comunidad feriante</span>
            <h3>¿Quiénes vienen?</h3>
          </div>

          <span class="participants-count">{{ participants.length }}</span>
        </header>

        <p class="participants-intro">
          Conocé algunos de los proyectos que forman parte de la feria.
        </p>

        <ul class="participants-list">
          <li
            v-for="person in participants"
            :key="person.id"
            class="participant-item"
          >
            <div class="participant-avatar" aria-hidden="true">
              {{ person.initials }}
            </div>

            <div class="participant-info">
              <h4>{{ person.name }}</h4>
              <span class="participant-category">{{ person.category }}</span>
            </div>

            <span class="participant-decoration" aria-hidden="true">↗</span>
          </li>
        </ul>

        <p class="participants-note">
          <span aria-hidden="true">✳</span>
          Proyectos locales, historias reales.
        </p>
      </aside>
    </div>
  </section>
</template>
<style scoped>
    
/* =========================================
   FERIA CALENDAR
   ========================================= */

.feria-calendar {
  width: 100%;
}

.feria-calendar__intro {
  max-width: 680px;
  margin: 0 auto 2.5rem;
  text-align: center;
}

.feria-calendar__intro h2 {
  margin: 0.5rem 0 0.75rem;
}

.feria-calendar__intro p {
  color: var(--color-soft);
  line-height: 1.7;
}

/* Layout: calendar centered + compact list on the right */

.feria-calendar__layout {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 300px;
  align-items: center;
  gap: 2rem;
  width: 100%;
  max-width: 1100px;
  margin: 0 auto;
}

/* =========================================
   CALENDAR
   ========================================= */

.feria-calendar .calendar-card {
  display: block;
  width: 100%;
  min-width: 0;
  max-width: 650px;
  justify-self: center;
  box-sizing: border-box;
  padding: 2rem;
  overflow: hidden;
  background: var(--color-surface);
  color: var(--color-text);
  border: 1px solid var(--color-border);
  border-radius: 1.5rem;
  box-shadow: var(--shadow);
}

.calendar-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  width: 100%;
}

.calendar-kicker {
  display: block;
  margin-bottom: 0.45rem;
  color: var(--color-primary);
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.calendar-header h3,
.participants-header h3 {
  margin: 0;
  color: var(--color-text);
  font-size: 1.5rem;
  line-height: 1.3;
  text-transform: capitalize;
}

.calendar-navigation {
  display: flex;
  flex-shrink: 0;
  gap: 0.5rem;
}

.calendar-nav-button {
  display: grid;
  place-items: center;
  width: 40px;
  height: 40px;
  padding: 0;
  border: 1px solid var(--color-border);
  border-radius: 50%;
  background: transparent;
  color: var(--color-text);
  font-size: 1.6rem;
  line-height: 1;
  cursor: pointer;
  transition: background 180ms ease, transform 180ms ease;
}

.calendar-nav-button:hover {
  background: var(--color-background);
  transform: scale(1.05);
}

/* Keep the seven columns intact */

.feria-calendar .calendar-grid {
  display: grid;
  grid-template-columns: repeat(7, minmax(0, 1fr));
  align-items: center;
  justify-items: center;
  gap: 0.55rem 0.35rem;
  width: 100%;
  margin-top: 1.75rem;
}

.feria-calendar .calendar-weekday {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  min-width: 0;
  padding: 0 0 0.5rem;
  color: var(--color-soft);
  font-size: 0.85rem;
  font-weight: 700;
  text-align: center;
}

.feria-calendar .calendar-cell {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: min(100%, 54px);
  aspect-ratio: 1;
  min-width: 0;
  padding: 0;
  box-sizing: border-box;
  border: 1px solid transparent;
  border-radius: 50%;
  background: transparent;
  color: var(--color-text);
  font-size: 1rem;
  line-height: 1;
}

.feria-calendar .calendar-cell--empty {
  visibility: hidden;
}

.feria-calendar .calendar-day-number {
  position: relative;
  z-index: 1;
}

.feria-calendar .calendar-day--event {
  background: var(--color-primary);
  color: var(--color-background);
  font-weight: 800;
}

.feria-calendar .calendar-event-dot {
  position: absolute;
  bottom: 7px;
  width: 4px;
  height: 4px;
  border-radius: 50%;
  background: currentColor;
}

.feria-calendar .calendar-day--today:not(.calendar-day--event) {
  border-color: var(--color-primary);
  font-weight: 800;
}

.calendar-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 0.75rem;
  margin-top: 1.5rem;
  padding-top: 1rem;
  border-top: 1px solid var(--color-border);
}

.calendar-legend {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: var(--color-text);
  font-size: 0.85rem;
}

.calendar-legend-circle {
  width: 12px;
  height: 12px;
  flex-shrink: 0;
  border-radius: 50%;
  background: var(--color-primary);
}

.calendar-footer p {
  margin: 0;
  color: var(--color-soft);
  font-size: 0.8rem;
}

/* =========================================
   PARTICIPANTS — compact and aligned
   ========================================= */

.feria-calendar .participants-card {
  display: block;
  width: 100%;
  min-width: 0;
  box-sizing: border-box;
  padding: 1.4rem;
  background: var(--color-background);
  color: var(--color-text);
  border: 1px solid var(--color-border);
  border-radius: 1.25rem;
  box-shadow: var(--shadow);
}

.feria-calendar .participants-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.5rem;
}

.feria-calendar .participants-header h3 {
  font-size: 1.25rem;
}

.participants-count {
  display: grid;
  place-items: center;
  flex-shrink: 0;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: var(--color-primary);
  color: var(--color-background);
  font-size: 0.8rem;
  font-weight: 800;
}

.feria-calendar .participants-intro {
  margin: 0.75rem 0 1.1rem;
  color: var(--color-soft);
  font-size: 0.85rem;
  line-height: 1.5;
}

.feria-calendar .participants-list {
  display: flex;
  flex-direction: column;
  gap: 0;
  width: 100%;
  margin: 0;
  padding: 0;
  list-style: none;
}

.feria-calendar .participant-item {
  display: grid;
  grid-template-columns: 38px minmax(0, 1fr);
  align-items: center;
  gap: 0.75rem;
  width: 100%;
  min-width: 0;
  box-sizing: border-box;
  padding: 0.85rem 0;
  border-bottom: 1px solid var(--color-border);
}

.feria-calendar .participant-item:first-child {
  padding-top: 0;
}

.feria-calendar .participant-item:last-child {
  border-bottom: none;
}

.feria-calendar .participant-avatar {
  display: grid;
  place-items: center;
  width: 38px;
  height: 38px;
  box-sizing: border-box;
  border-radius: 40% 60% 55% 45%;
  background: var(--color-primary);
  color: var(--color-background);
  font-size: 0.75rem;
  font-weight: 800;
}

.feria-calendar .participant-info {
  display: block;
  min-width: 0;
  width: 100%;
  text-align: left;
}

.feria-calendar .participant-info h4 {
  display: block;
  margin: 0 0 0.25rem;
  padding: 0;
  color: var(--color-text);
  font-size: 0.9rem;
  line-height: 1.35;
  text-align: left;
  overflow-wrap: anywhere;
}

.feria-calendar .participant-category {
  display: block;
  margin: 0;
  padding: 0;
  color: var(--color-primary);
  font-size: 0.75rem;
  line-height: 1.45;
  text-align: left;
  overflow-wrap: anywhere;
}

.feria-calendar .participant-decoration {
  display: none;
}

.feria-calendar .participants-note {
  display: flex;
  align-items: flex-start;
  gap: 0.5rem;
  margin: 1rem 0 0;
  color: var(--color-soft);
  font-size: 0.8rem;
  line-height: 1.5;
}

.feria-calendar .participants-note span {
  flex-shrink: 0;
  color: var(--color-primary);
}

/* =========================================
   RESPONSIVE
   ========================================= */

@media (max-width: 900px) {
  .feria-calendar__layout {
    grid-template-columns: minmax(0, 1fr) 270px;
    gap: 1.25rem;
  }

  .feria-calendar .calendar-card {
    padding: 1.4rem;
  }

  .feria-calendar .participants-card {
    padding: 1.1rem;
  }

  .feria-calendar .calendar-grid {
    gap: 0.35rem 0.15rem;
  }

  .feria-calendar .calendar-cell {
    font-size: 0.9rem;
  }
}

@media (max-width: 700px) {
  .feria-calendar__layout {
    grid-template-columns: minmax(0, 1fr);
    max-width: 560px;
  }

  .feria-calendar .calendar-card {
    width: 100%;
    max-width: none;
    padding: 1.4rem;
  }

  .feria-calendar .participants-card {
    width: 100%;
    padding: 1.25rem;
  }

  .feria-calendar .calendar-cell {
    width: min(100%, 54px);
    font-size: 1rem;
  }
}

@media (max-width: 380px) {
  .feria-calendar .calendar-card {
    padding: 0.9rem;
  }

  .feria-calendar .calendar-grid {
    gap: 0.3rem 0.05rem;
    margin-top: 1.25rem;
  }

  .feria-calendar .calendar-weekday {
    font-size: 0.72rem;
  }

  .feria-calendar .calendar-cell {
    font-size: 0.85rem;
  }

  .feria-calendar .calendar-header h3 {
    font-size: 1.2rem;
  }

  .feria-calendar .calendar-nav-button {
    width: 34px;
    height: 34px;
  }
}
</style>
