<script setup>
import { ref, computed } from 'vue';

const MONTHS = [
  'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre',
];
const WEEK_DAYS = ['D', 'L', 'M', 'M', 'J', 'V', 'S'];

const today = new Date();
const viewYear = ref(today.getFullYear());
const viewMonth = ref(today.getMonth());
const selected = ref(null);

const monthLabel = computed(() => MONTHS[viewMonth.value] + ' ' + viewYear.value);

function daysInMonth(year, month) {
  return new Date(year, month + 1, 0).getDate();
}

/* Eventos del mes: cada sábado feria, domingos pares feria especial,
   día 10 taller infantil, día 20 degustación. */
function eventsFor(year, month) {
  const total = daysInMonth(year, month);
  const events = {};
  for (let d = 1; d <= total; d++) {
    const dow = new Date(year, month, d).getDay();
    const list = [];
    if (dow === 6) {
      list.push({ type: 'fair', title: 'Feria de productores', time: '10:00 – 14:00', place: 'Plaza central', color: 'bg-grass' });
    }
    if (dow === 0 && Math.ceil(d / 7) % 2 === 0) {
      list.push({ type: 'special', title: 'Feria especial de emprendedores', time: '10:00 – 15:00', place: 'Paseo de los árboles', color: 'bg-clay' });
    }
    if (d === 10) {
      list.push({ type: 'workshop', title: 'Taller infantil: huerta en casa', time: '16:00 – 17:30', place: 'Carpa de talleres', color: 'bg-sky' });
    }
    if (d === 20) {
      list.push({ type: 'tasting', title: 'Degustación de productos de estación', time: '11:00 – 13:00', place: 'Puesto comunitario', color: 'bg-berry' });
    }
    if (list.length) events[d] = list;
  }
  return events;
}

const monthEvents = computed(() => eventsFor(viewYear.value, viewMonth.value));

const leadingBlanks = computed(() => new Date(viewYear.value, viewMonth.value, 1).getDay());

const calendarDays = computed(() => {
  const total = daysInMonth(viewYear.value, viewMonth.value);
  const days = [];
  for (let i = 0; i < leadingBlanks.value; i++) days.push(null);
  for (let d = 1; d <= total; d++) days.push(d);
  return days;
});

const isToday = (d) =>
  d === today.getDate() &&
  viewMonth.value === today.getMonth() &&
  viewYear.value === today.getFullYear();

function changeMonth(delta) {
  let m = viewMonth.value + delta;
  let y = viewYear.value;
  if (m < 0) { m = 11; y--; }
  if (m > 11) { m = 0; y++; }
  viewMonth.value = m;
  viewYear.value = y;
  selected.value = null;
}

function selectDay(d) {
  selected.value = monthEvents.value[d] ? d : null;
}

/* Próximos eventos reales a partir de hoy */
const upcoming = computed(() => {
  const result = [];
  const cursor = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  for (let i = 0; i < 120 && result.length < 4; i++) {
    const y = cursor.getFullYear();
    const m = cursor.getMonth();
    const d = cursor.getDate();
    const evts = eventsFor(y, m)[d];
    if (evts && (y > today.getFullYear() || m > today.getMonth() || d >= today.getDate())) {
      result.push({ date: d + ' de ' + MONTHS[m].toLowerCase(), events: evts });
    }
    cursor.setDate(cursor.getDate() + 1);
  }
  return result;
});

const TYPE_LABELS = {
  fair: 'Feria',
  special: 'Especial',
  workshop: 'Taller',
  tasting: 'Degustación',
};
</script>

<template>
  <div class="grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
    <!-- Calendario -->
    <div class="play-card p-5 sm:p-8">
      <div class="flex items-center justify-between gap-3">
        <button
          type="button"
          class="rounded-full border-4 border-ink bg-paper p-2 shadow-[3px_3px_0_0_#2F3A2F] transition-transform hover:-translate-y-0.5 active:translate-y-0"
          :aria-label="'Mes anterior: ' + monthLabel"
          @click="changeMonth(-1)"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#2F3A2F" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M15 5l-7 7 7 7"/></svg>
        </button>
        <h3 class="text-center font-display text-2xl font-extrabold">{{ monthLabel }}</h3>
        <button
          type="button"
          class="rounded-full border-4 border-ink bg-paper p-2 shadow-[3px_3px_0_0_#2F3A2F] transition-transform hover:-translate-y-0.5 active:translate-y-0"
          :aria-label="'Mes siguiente: ' + monthLabel"
          @click="changeMonth(1)"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#2F3A2F" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M9 5l7 7-7 7"/></svg>
        </button>
      </div>

      <div class="mt-6 grid grid-cols-7 gap-1.5 sm:gap-2" role="grid" :aria-label="'Calendario de ' + monthLabel">
        <span
          v-for="day in WEEK_DAYS"
          :key="day"
          class="pb-2 text-center font-display text-sm font-extrabold uppercase text-muted"
          aria-hidden="true"
        >{{ day }}</span>

        <template v-for="(day, i) in calendarDays" :key="i">
          <span v-if="day === null" aria-hidden="true"></span>
          <button
            v-else
            type="button"
            role="gridcell"
            class="relative aspect-square rounded-xl border-2 font-display text-sm font-bold transition-all sm:text-base"
            :class="[
              isToday(day)
                ? 'border-ink bg-sun text-ink shadow-[2px_2px_0_0_#2F3A2F]'
                : monthEvents[day]
                  ? 'border-ink bg-paper hover:-translate-y-0.5 hover:bg-sun-light'
                  : 'border-transparent text-muted hover:bg-sun-light/60',
              selected === day ? '!bg-clay !text-white shadow-[2px_2px_0_0_#2F3A2F]' : '',
            ]"
            :aria-label="'Día ' + day + (monthEvents[day] ? ' — tiene eventos' : '')"
            :aria-pressed="selected === day"
            @click="selectDay(day)"
          >
            {{ day }}
            <span v-if="monthEvents[day]" class="absolute bottom-1 left-1/2 flex -translate-x-1/2 gap-0.5" aria-hidden="true">
              <span
                v-for="(ev, j) in monthEvents[day].slice(0, 3)"
                :key="j"
                class="h-1.5 w-1.5 rounded-full bg-ink"
                :class="{ '!bg-white': selected === day }"
              ></span>
            </span>
          </button>
        </template>
      </div>

      <!-- Detalle del día seleccionado -->
      <div v-if="selected" class="mt-6 rounded-2xl border-2 border-dashed border-ink bg-cream p-4">
        <p class="font-display font-extrabold">{{ selected }} de {{ monthLabel.toLowerCase() }}</p>
        <ul class="mt-2 space-y-2">
          <li v-for="ev in monthEvents[selected]" :key="ev.title" class="flex items-center gap-2 text-sm font-bold">
            <span class="h-3 w-3 rounded-full border border-ink" :class="ev.color" aria-hidden="true"></span>
            {{ ev.title }} · {{ ev.time }} · {{ ev.place }}
          </li>
        </ul>
      </div>
      <p v-else class="mt-6 text-center text-sm font-bold text-muted">
        Tocá un día con puntitos para ver el evento
      </p>
    </div>

    <!-- Próximos eventos -->
    <aside class="flex flex-col gap-4" aria-label="Próximos eventos">
      <h3 class="font-display text-2xl font-extrabold">Próximos eventos</h3>
      <ol class="flex flex-col gap-4">
        <li
          v-for="item in upcoming"
          :key="item.date"
          class="play-card flex items-start gap-4 p-4 transition-transform hover:-translate-y-1 hover:rotate-1"
        >
          <div class="flex h-14 w-14 shrink-0 rotate-3 items-center justify-center rounded-2xl border-2 border-ink bg-sun font-display text-lg font-extrabold leading-none">
            {{ item.date.split(' ')[0] }}
            <span class="block text-[10px] uppercase">{{ item.date.split(' ')[2]?.slice(0,3) }}</span>
          </div>
          <div>
            <p class="font-display font-extrabold leading-tight">{{ item.events[0].title }}</p>
            <p class="mt-1 text-sm text-muted">{{ item.events[0].time }} · {{ item.events[0].place }}</p>
            <span
              class="mt-2 inline-block rounded-full border-2 border-ink px-2.5 py-0.5 text-[11px] font-extrabold uppercase tracking-wide"
              :class="item.events[0].color + ' text-white'"
            >{{ TYPE_LABELS[item.events[0].type] }}</span>
          </div>
        </li>
      </ol>
      <a href="#" class="btn-primary self-start !text-base">Quiero participar</a>
    </aside>
  </div>
</template>
