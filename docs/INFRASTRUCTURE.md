# INFRASTRUCTURE.md — Setup de Qualidade e CI/CD

> **Quando ler:** Apenas no primeiro prompt. Depois que a infra estiver configurada e commitada, este arquivo não precisa ser relido.

---

## 1. Dependências de Dev

```bash
# Linting + formatação
npm install -D eslint @eslint/js typescript-eslint eslint-plugin-react eslint-plugin-react-hooks eslint-plugin-react-native prettier eslint-config-prettier

# Testes
npx expo install -- --save-dev jest @testing-library/react-native @testing-library/jest-native jest-expo @types/jest

# Git hooks
npm install -D husky lint-staged

# Commits convencionais
npm install -D @commitlint/cli @commitlint/config-conventional
```

---

## 2. ESLint — `eslint.config.mjs`

```javascript
import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import reactPlugin from 'eslint-plugin-react';
import reactHooksPlugin from 'eslint-plugin-react-hooks';
import reactNativePlugin from 'eslint-plugin-react-native';
import prettierConfig from 'eslint-config-prettier';

export default tseslint.config(
  js.configs.recommended,
  ...tseslint.configs.recommended,
  prettierConfig,
  {
    plugins: {
      react: reactPlugin,
      'react-hooks': reactHooksPlugin,
      'react-native': reactNativePlugin,
    },
    languageOptions: {
      parserOptions: { ecmaFeatures: { jsx: true } },
    },
    settings: { react: { version: 'detect' } },
    rules: {
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
      '@typescript-eslint/no-explicit-any': 'error',
      '@typescript-eslint/consistent-type-imports': 'warn',
      'react/react-in-jsx-scope': 'off',
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn',
      'react-native/no-inline-styles': 'error',
      'react-native/no-color-literals': 'warn',
      'react-native/no-unused-styles': 'warn',
      'no-console': ['warn', { allow: ['warn', 'error'] }],
    },
  },
  {
    ignores: ['node_modules/', 'android/', 'ios/', '.expo/', 'dist/', 'babel.config.js', 'metro.config.js'],
  },
);
```

---

## 3. Prettier — `.prettierrc`

```json
{
  "semi": true,
  "singleQuote": true,
  "trailingComma": "all",
  "printWidth": 100,
  "tabWidth": 2,
  "bracketSpacing": true,
  "arrowParens": "always",
  "endOfLine": "lf"
}
```

---

## 4. Jest — `jest.config.js`

```javascript
module.exports = {
  preset: 'jest-expo',
  setupFilesAfterSetup: ['@testing-library/jest-native/extend-expect'],
  transformIgnorePatterns: [
    'node_modules/(?!((jest-)?react-native|@react-native(-community)?)|expo(nent)?|@expo(nent)?/.*|@expo-google-fonts/.*|react-navigation|@react-navigation/.*|@sentry/react-native|native-base|react-native-svg|lucide-react-native)',
  ],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    '!src/**/*.d.ts',
    '!src/app/**/_layout.tsx',
    '!src/types/**',
  ],
  coverageThreshold: {
    global: { branches: 50, functions: 50, lines: 60, statements: 60 },
  },
};
```

**Estrutura de testes:** `__tests__/` adjacente ao arquivo testado:
```
src/components/ui/Button.tsx       → src/components/ui/__tests__/Button.test.tsx
src/data/nutrition-engine.ts       → src/data/__tests__/nutrition-engine.test.ts
src/utils/match-profile.ts        → src/utils/__tests__/match-profile.test.ts
```

---

## 5. Husky + lint-staged

```bash
npx husky init
```

`.husky/pre-commit`:
```bash
npx lint-staged
```

`.husky/commit-msg`:
```bash
npx --no -- commitlint --edit $1
```

`package.json` — adicionar:
```json
{
  "lint-staged": {
    "src/**/*.{ts,tsx}": ["eslint --fix --max-warnings 0", "prettier --write"],
    "src/**/*.{json,md}": ["prettier --write"]
  }
}
```

---

## 6. Commitlint — `commitlint.config.js`

```javascript
module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'type-enum': [2, 'always', [
      'feat', 'fix', 'docs', 'style', 'refactor', 'test', 'chore', 'ci', 'perf',
    ]],
    'subject-case': [2, 'never', ['start-case', 'pascal-case', 'upper-case']],
  },
};
```

---

## 7. Scripts — `package.json`

```json
{
  "scripts": {
    "start": "expo start",
    "android": "expo run:android",
    "ios": "expo run:ios",
    "lint": "eslint src/",
    "lint:fix": "eslint src/ --fix",
    "format": "prettier --write 'src/**/*.{ts,tsx,json,md}'",
    "format:check": "prettier --check 'src/**/*.{ts,tsx,json,md}'",
    "typecheck": "tsc --noEmit",
    "test": "jest",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage",
    "validate": "npm run typecheck && npm run lint && npm run format:check && npm run test",
    "doctor": "npx expo-doctor"
  }
}
```

---

## 8. GitHub Actions — `.github/workflows/ci.yml`

```yaml
name: CI

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main, develop]

concurrency:
  group: ${{ github.workflow }}-${{ github.ref }}
  cancel-in-progress: true

jobs:
  validate:
    name: Lint, Typecheck & Test
    runs-on: ubuntu-latest
    timeout-minutes: 15
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: 22, cache: 'npm' }
      - run: npm ci
      - run: npm run typecheck
      - run: npm run lint
      - run: npm run format:check
      - run: npm run test -- --ci --coverage --maxWorkers=2
      - uses: actions/upload-artifact@v4
        if: always()
        with: { name: coverage-report, path: coverage/, retention-days: 7 }
      - run: npx expo-doctor

  build-android:
    name: Android Build Check
    runs-on: ubuntu-latest
    needs: validate
    if: github.event_name == 'push' && github.ref == 'refs/heads/main'
    timeout-minutes: 30
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: 22, cache: 'npm' }
      - uses: actions/setup-java@v4
        with: { distribution: 'temurin', java-version: '17' }
      - run: npm ci
      - uses: expo/expo-github-action@v8
        with: { eas-version: latest, token: '${{ secrets.EXPO_TOKEN }}' }
      - run: npx expo prebuild --platform android --clean
      - run: cd android && ./gradlew assembleDebug
```

---

## 9. GitHub Actions — `.github/workflows/eas-preview.yml`

```yaml
name: EAS Preview Build

on:
  pull_request:
    branches: [main]
    types: [opened, synchronize]

jobs:
  preview:
    name: EAS Preview
    runs-on: ubuntu-latest
    timeout-minutes: 45
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: 22, cache: 'npm' }
      - run: npm ci
      - uses: expo/expo-github-action@v8
        with: { eas-version: latest, token: '${{ secrets.EXPO_TOKEN }}' }
      - run: eas build --platform android --profile preview --non-interactive
      - if: success()
        uses: actions/github-script@v7
        with:
          script: |
            github.rest.issues.createComment({
              issue_number: context.issue.number,
              owner: context.repo.owner,
              repo: context.repo.repo,
              body: '📱 Preview build started on EAS. Check [Expo dashboard](https://expo.dev) for APK.'
            })
```

---

## 10. EAS Config — `eas.json`

```json
{
  "cli": { "version": ">= 15.0.0" },
  "build": {
    "development": {
      "developmentClient": true,
      "distribution": "internal",
      "android": { "buildType": "apk" }
    },
    "preview": {
      "distribution": "internal",
      "android": { "buildType": "apk" },
      "env": {
        "EXPO_PUBLIC_SUPABASE_URL": "${EXPO_PUBLIC_SUPABASE_URL}",
        "EXPO_PUBLIC_SUPABASE_ANON_KEY": "${EXPO_PUBLIC_SUPABASE_ANON_KEY}"
      }
    },
    "production": {
      "android": { "buildType": "app-bundle" }
    }
  }
}
```

---

## 11. `.gitignore` — garantir que inclui

```gitignore
.expo/
dist/
android/
ios/
node_modules/
.env
.env.local
coverage/
.DS_Store
Thumbs.db
```

---

## Secrets do GitHub

Settings → Secrets → Actions:
- `EXPO_TOKEN` — gerar em expo.dev/settings/access-tokens