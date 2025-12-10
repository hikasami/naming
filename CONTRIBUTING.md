# Contributing to @hikasami/naming

Thank you for your interest in contributing to HCNC!

## Development Setup

```bash
# Clone the repository
git clone https://github.com/hikasami/naming.git
cd naming

# Install dependencies
pnpm install

# Run tests
pnpm test

# Build
pnpm build

# Development mode (watch)
pnpm dev
```

## Project Structure

```
@hikasami/naming/
├── src/
│   ├── index.ts      # Main API exports
│   ├── utils.ts      # HCNC validators
│   ├── biome.ts      # BiomeJS configuration
│   ├── cli.ts        # CLI tool
│   └── test.ts       # Tests
├── rules/
│   ├── hcnc-jsx.grit # GritQL rules for JSX/TSX
│   └── hcnc-css.grit # GritQL rules for CSS/SCSS
├── scripts/
│   └── postinstall.js
├── .github/
│   └── workflows/
│       ├── ci.yml      # CI workflow
│       └── publish.yml # Publish workflow
└── package.json
```

## Running Tests

```bash
pnpm test
```

All tests should pass before submitting a PR.

## Code Style

We use BiomeJS for linting and formatting:

```bash
pnpm lint
```

## License

By contributing, you agree that your contributions will be licensed under the MIT License.