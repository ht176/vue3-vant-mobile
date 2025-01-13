import antfu from '@antfu/eslint-config'

export default antfu(
  {
    vue: true,
    typescript: true,

    // enable UnoCSS support
    // https://unocss.dev/integrations/vscode
    unocss: true,

    formatters: {
      css: true,
    },

  },
  {
    rules: {
      'vue/block-order': 'off',
      'perfectionist/sort-imports': 'off',
      'perfectionist/sort-exports': 'off',
      'perfectionist/sort-named-exports': 'off',
      'no-console': 0,
      'eslint-comments/no-unlimited-disable': 'off',
    },
  },
  {
    ignores: [
      '.github/**',
      'scripts/**',
    ],
  },
)
