const { defineConfig } = require("eslint/config");
const expoConfig = require("eslint-config-expo/flat");

module.exports = defineConfig([
  ...expoConfig,
  {
    // Orval rewrites this tree wholesale on `yarn api:generate`;
    // linting (and auto-fixing) machine output would be undone on the next run.
    ignores: ["node_modules/", ".expo/", "dist/", "src/shared/api/generated/"],
  },
]);
