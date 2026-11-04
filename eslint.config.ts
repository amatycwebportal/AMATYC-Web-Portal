import tseslint from 'typescript-eslint'

export default tseslint.config(
  ...tseslint.configs.recommended,
  {
    files: ['frontend/src/**/*.{ts,tsx}'],
    rules: {
      '@typescript-eslint/no-unused-vars': 'warn',
      '@typescript-eslint/no-explicit-any': 'warn',
    }
  },
  {
    files: ['backend/src/**/*.ts'],
    rules: {
      '@typescript-eslint/no-unused-vars': 'warn',
      '@typescript-eslint/no-explicit-any': 'warn',
    }
  },
  {
    ignores: [
      'frontend/dist/**',
      'backend/dist/**',
      'frontend/src/theme/**',
      'backend/src/generated/**',
      'backend/prisma/migrations/**',
      '**/node_modules/**',
    ]
  }
)