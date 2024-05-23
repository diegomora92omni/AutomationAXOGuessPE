  const { defineConfig } = require('cypress');

  module.exports = defineConfig({
    viewportWidth: 1366,
    viewportHeight: 768,
    reporter: 'cypress-mochawesome-reporter',
    reporterOptions: {
      charts: true,
      reportPageTitle: 'Reporter Automation Project GUESS (AXO)',
      embeddedScreenshots: true,
      inlineAssets: true,
      saveAllAttempts: false,
    },
    retries: 4,
    defaultCommandTimeout: 5000,
    fixturesFolder: 'cypress/fixtures',
    supportFolder: 'cypress/support',
    e2e: {
      setupNodeEvents(on, config) {
        require('cypress-mochawesome-reporter/plugin')(on);
      },
    },
  })
