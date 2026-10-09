// @ts-check
import { defineConfig } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';
import vue from '@astrojs/vue';

// https://astro.build/config
export default defineConfig({
site: 'https://Pablo-alum.github.io',
base: '/feria-en-territorio',

vite: {
plugins: [tailwindcss()]
},

integrations: [vue()]
});
