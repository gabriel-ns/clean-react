import { defineConfig } from 'cypress'

export default defineConfig({
  e2e: {
    setupNodeEvents (on, config) {
    },
    baseUrl: 'http://localhost:8080',
    fixturesFolder: false,
    supportFile: false,
    specPattern: 'src/main/test/cypress/e2e/**/*.spec.{js,jsx,ts,tsx}'
  }
})
