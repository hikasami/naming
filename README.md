# @hikasami/naming

**HCNC** (Hikasami CSS Naming Convention) — внутренняя методология наименования CSS-классов, основанная на BEM и дополненная утилитарными классами и camelCase состояниями.

[![npm version](https://img.shields.io/npm/v/@hikasami/naming.svg)](https://www.npmjs.com/package/@hikasami/naming)
[![CI](https://github.com/hikasami/naming/actions/workflows/ci.yml/badge.svg)](https://github.com/hikasami/naming/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Made by Hikasami](https://img.shields.io/badge/Made%20by-Hikasami%20Inc.-eb0052)](https://github.com/hikasami)

## Установка

```bash
# npm
npm install @hikasami/naming --save-dev

# pnpm
pnpm add -D @hikasami/naming

# yarn
yarn add -D @hikasami/naming
```

## Правила именования HCNC

| Тип | Формат | Пример |
|-----|--------|--------|
| Блок | lowercase/kebab | `card`, `button`, `header-nav` |
| Элемент 1 ур. | `_` | `card_info`, `button_icon` |
| Элемент вложен. | `__` | `card_info__title` |
| Модификатор | `--` | `card--highlighted` |
| Состояние | is/has + camelCase | `isActive`, `hasError` |
| Утилиты | atomic | `mt-2`, `flex`, `text-sm` |

### Примеры

```html
<!-- Блок -->
<div class="card"></div>

<!-- Элемент первого уровня -->
<div class="card_info"></div>

<!-- Вложенный элемент -->
<h3 class="card_info__title"></h3>

<!-- Модификатор -->
<div class="card card--highlighted"></div>

<!-- Состояние -->
<button class="button isActive">Click</button>

<!-- Полный пример -->
<div class="card card--highlighted isActive">
  <div class="card_info flex mt-2">
    <h3 class="card_info__title">Title</h3>
    <p class="card_info__description">Description</p>
  </div>
  <button class="button isActive">
    <svg class="button_icon"></svg>
  </button>
</div>
```

### SCSS вложенность

```scss
.card {
  &_info {
    display: flex;

    &__title {
      font-weight: bold;
    }

    &__description {
      color: #777;
    }
  }

  &--highlighted {
    border: 2px solid #eb0052;
  }

  &.isActive {
    opacity: 1;
  }
}
```

## Использование

### Интеграция с BiomeJS

Самый простой способ — использовать команду `init`:

```bash
npx hcnc init
```

Это автоматически добавит плагины в ваш `biome.json`:

```json
{
  "plugins": [
    "./node_modules/@hikasami/naming/rules/hcnc-jsx.grit",
    "./node_modules/@hikasami/naming/rules/hcnc-css.grit"
  ]
}
```

После этого запустите линтер:

```bash
biome check ./src
```

### CLI

```bash
# Инициализация (добавляет плагины в biome.json)
npx hcnc init

# Валидация строки классов
npx hcnc validate "card card_info isActive"

# Проверка директории
npx hcnc check ./src

# Помощь
npx hcnc help
```

### Программный API

```typescript
import { 
  validateClassName, 
  validateClassString, 
  isHcncClass,
  getClassType 
} from '@hikasami/naming';

// Валидация одного класса
const result = validateClassName('card_info__title');
console.log(result);
// { valid: true, type: 'nested-element' }

// Валидация строки классов
const results = validateClassString('card card--highlighted isActive mt-2');
// [
//   { valid: true, type: 'block' },
//   { valid: true, type: 'modifier' },
//   { valid: true, type: 'state' },
//   { valid: true, type: 'utility' }
// ]

// Проверка типа класса
console.log(getClassType('isActive')); // 'state'
console.log(getClassType('card_info')); // 'element'
console.log(getClassType('mt-2')); // 'utility'

// Проверка валидности
if (isHcncClass('button_icon')) {
  console.log('Valid HCNC class!');
}
```

### Конфигурация

```typescript
import { validateClassName, HcncConfig } from '@hikasami/naming';

const config: HcncConfig = {
  // Дополнительные паттерны утилит (regex)
  customUtilities: ['^my-custom-.*$', '^theme-.*$'],
  
  // Разрешить неизвестные классы без ошибки
  allowUnknown: false,
  
  // Строгий режим — без утилит
  strictBem: false,
};

validateClassName('my-custom-class', config);
```

## Интеграция с BiomeJS

### Настройка biome.json

```json
{
  "$schema": "https://biomejs.dev/schemas/1.9.4/schema.json",
  "linter": {
    "enabled": true
  }
}
```

### GritQL правила

Скопируйте правила из `node_modules/@hikasami/naming/rules/` в ваш проект:

```
rules/
├── hcnc-jsx.grit   # Правила для JSX/TSX
└── hcnc-css.grit   # Правила для CSS/SCSS
```

## API Reference

### Функции валидации

| Функция | Описание |
|---------|----------|
| `isBlock(className)` | Проверяет, является ли класс блоком |
| `isElement(className)` | Проверяет, является ли класс элементом (L1) |
| `isNestedElement(className)` | Проверяет, является ли класс вложенным элементом (L2) |
| `isModifier(className)` | Проверяет, является ли класс модификатором |
| `isStateClass(className)` | Проверяет, является ли класс состоянием |
| `isUtilityClass(className, customPatterns?)` | Проверяет, является ли класс утилитой |
| `isHcncClass(className)` | Проверяет BEM-совместимость (без состояний и утилит) |
| `validateClassName(className, config?)` | Полная валидация с типом и сообщением об ошибке |
| `validateClassString(classString, config?)` | Валидация строки классов |
| `getClassType(className, config?)` | Получить тип класса |
| `getInvalidClasses(classString, config?)` | Получить только невалидные классы |

### Функции для CSS

| Функция | Описание |
|---------|----------|
| `extractClassSelectors(selector)` | Извлечь классы из CSS селектора |
| `validateCssSelector(selector, config?)` | Валидировать CSS селектор |
| `expandScssNesting(scss)` | Развернуть SCSS вложенность |
| `parseClassString(classString)` | Разбить строку на массив классов |

### Типы

```typescript
interface ValidationResult {
  valid: boolean;
  type: HcncClassType | null;
  message?: string;
}

type HcncClassType = 
  | 'block'
  | 'element'
  | 'nested-element'
  | 'modifier'
  | 'state'
  | 'utility';

interface HcncConfig {
  customUtilities?: string[];
  allowUnknown?: boolean;
  strictBem?: boolean;
}
```

## Поддерживаемые форматы

- ✅ HTML
- ✅ JavaScript (JS)
- ✅ TypeScript (TS)
- ✅ JSX
- ✅ TSX
- ✅ CSS
- ✅ SCSS
- ✅ Sass

## Разработка

```bash
# Установка зависимостей
pnpm install

# Сборка
pnpm build

# Разработка с watch
pnpm dev

# Тесты
pnpm test

# Линтинг
pnpm lint
```

## Лицензия

MIT © Hikasami

