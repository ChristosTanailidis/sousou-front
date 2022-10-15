import { defineConfig } from 'windicss/helpers'

export default defineConfig({
  extract: {
    include: ['src/**/*.{html,vue,jsx,tsx,svelte}']
  },
  theme: {
    extend: {
      colors: {
        primary: 'var(--q-primary)',
        secondary: 'var(--q-secondary)',
        accent: 'var(--q-accent)',
        positive: 'var(--q-positive)',
        negative: 'var(--q-negative)',
        info: 'var(--q-info)',
        warning: 'var(--q-warning)'
      }
    }
  }
})
