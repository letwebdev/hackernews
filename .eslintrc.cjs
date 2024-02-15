/* eslint-env node */
module.exports = {
  root: true,
  extends: [
    "eslint:recommended",
    "airbnb-base",
    "plugin:import/recommended",
    "plugin:import/typescript",
    "plugin:@typescript-eslint/recommended",
    "@vue/eslint-config-prettier/skip-formatting",
    "@vue/eslint-config-typescript",
    "plugin:vue/vue3-recommended",
  ],
  settings: {
    "import/parsers": {
      "@typescript-eslint/parser": [".ts", ".tsx"],
    },
  },
  parserOptions: {
    ecmaVersion: "latest",
  },
  rules: {
    "vue/no-v-html": 0,
    "no-else-return": 0,
    "prefer-destructuring": 0,
    "lines-between-class-members": 0,
    "import/no-extraneous-dependencies": ["error", { devDependencies: true }],
    "no-console": 0,
    "no-plusplus": 0,
    "import/prefer-default-export": 0,
    "@typescript-eslint/no-explicit-any": 0,
    "import/extensions": 0,
    /**
     * false positive reports with Vite
     * @see https://github.com/import-js/eslint-plugin-import/blob/main/docs/rules/no-unresolved.md
     */
    "import/no-unresolved": 0,
    "no-use-before-define": ["error", { functions: false }],
    "no-param-reassign": ["error", { props: false }],
    "no-restricted-syntax": 0,
    "consistent-return": 0,
  },
}
