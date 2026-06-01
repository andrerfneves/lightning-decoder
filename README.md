# Lightning Decoder

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Built with Vite](https://img.shields.io/badge/Built%20with-Vite-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
[![React 19](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white)](https://react.dev/)
[![shadcn/ui](https://img.shields.io/badge/UI-shadcn%2Fui-black?logo=shadcnui&logoColor=white)](https://ui.shadcn.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-CSS-38B2AC?logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Storybook](https://img.shields.io/badge/Storybook-FF4785?logo=storybook&logoColor=white)](https://storybook.js.org/)

> [https://lightningdecoder.com](https://lightningdecoder.com)

![Image of Lightning Decoder](https://i.imgur.com/mg6opec.png)

A modern, developer-focused utility for parsing and understanding Lightning Network payment data. Built with React 19, TypeScript, and shadcn/ui for the Bitcoin/Lightning ecosystem.

## ✨ Features

### Core Functionality

- **Lightning Address Resolution** — Resolve Lightning Addresses (user@domain.com) to their LNURL-pay endpoints and inspect response data
- **LNURL Decoding** — Decode [LNURL](https://github.com/lnurl/luds) requests (lnurl-pay, lnurl-withdraw, lnurl-auth, lnurl-channel) to inspect callback URLs and parameters
- **BOLT11 Invoice Decoding** — Parse Lightning Network invoices to view amount, description, expiry, payment hash, routing hints, and encoded fields
- **BOLT12 Offer Support** — Decode BOLT12 offers, invoices, and invoice requests using the latest Lightning Network standard
- **QR Code Scanning** — Scan QR codes directly from your camera to decode Lightning payment data
- **LUD-01 Fallback Support** — Handle URLs with `lightning=` query parameters per the LUD-01 specification

### Developer Experience

- **Light & Dark Themes** — System-aware theme with persistent preference storage
- **Component Library** — Built with shadcn/ui components, fully customizable
- **Storybook Documentation** — Interactive component documentation with live examples
- **Type Safety** — Full TypeScript support across the codebase
- **Comprehensive Testing** — 33 tests covering all invoice types and edge cases
- **Modern Architecture** — Modular component design with clear separation of concerns

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ (recommended: 20+)
- npm, yarn, or pnpm

### Installation

```bash
# Clone the repository
git clone https://github.com/andrerfneves/lightning-decoder.git
cd lightning-decoder

# Install dependencies
npm install

# Start development server
npm run dev
```

The app will be available at `http://localhost:5173`.

## 📖 Usage

### Web Interface

1. Visit [lightningdecoder.com](https://lightningdecoder.com) or run locally
2. Paste a Lightning invoice, LNURL, or Lightning Address into the input field
3. Press Enter or click the decode button
4. View the decoded payment data in a structured format

### Supported Formats

```bash
# Lightning Address
user@domain.com

# LNURL
LNURL1DP68GURN8GHJ7UM9WFMXJCM99E3K7MF0V9CXJ0M385EKVCENX...

# BOLT11 Invoice
lnbc10u1p3pj257pp5yztkwjcz5ftl4laxkla5ue77w3lpax8qzqj8qzqj8qz...

# BOLT12 Offer
lno1qgsqvgnwgcg35z6ee2h3yczraddm72xrfua9uve2rlrm9deu7xyfzrc2q3...

# URL with lightning= parameter
https://example.com/pay?lightning=LNURL1DP68GURN8GHJ7UM9WFMXJCM99E3K7...
```

## 🎨 Storybook

Explore all components in an interactive environment:

```bash
# Start Storybook
npm run storybook

# Build Storybook
npm run build-storybook
```

Storybook will be available at `http://localhost:6006`.

## 🏗️ Architecture

### Component Structure

```
src/
├── components/
│   ├── ui/                    # shadcn/ui base components
│   │   ├── button.tsx
│   │   ├── input.tsx
│   │   ├── card.tsx
│   │   └── ...
│   ├── header.tsx             # App header with theme toggle
│   ├── search-input.tsx       # Invoice/address input
│   ├── invoice-details.tsx    # Decoded invoice display
│   ├── error-display.tsx      # Error/warning callout component
│   └── theme-provider.tsx     # Theme context provider
├── lib/
│   └── utils.ts               # Utility functions (cn helper)
├── utils/
│   ├── app-routes.ts          # Reserved route and invoice URL helpers
│   ├── invoices.js            # Invoice parsing logic
│   ├── internet-identifier.js # Lightning Address validation
│   └── keys.js                # Key formatting utilities
└── app.tsx                    # Main application component
```

### Key Libraries

- **bitcoinjs-lib** — BOLT11 invoice decoding
- **bech32** — LNURL bech32 decoding
- **bolt12-decoder** — BOLT12 offer/invoice parsing
- **@radix-ui** — Accessible UI primitives
- **lucide-react** — Beautiful icon set
- **tailwind-merge** — Smart class merging

## 🧪 Testing

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

Current coverage: **33 tests** across 5 test suites

- Invoice parsing (BOLT11, LNURL, BOLT12)
- Lightning Address validation
- LUD-01 fallback scheme support
- Edge cases and error handling

## 🚢 Deployment

### Quick Deploy

- **[Vercel](./DEPLOYMENT_VERCEL.md)** — One-click deployment with automatic CI/CD
- **[Docker](./DEPLOYMENT_DOCKER.md)** — Containerized deployment for any environment
- **[Static Hosting](./DEPLOYMENT.md)** — Deploy to any static hosting service

### Build for Production

```bash
# Build optimized production bundle
npm run build

# Preview production build locally
npm run preview
```

Output is generated in the `dist/` directory.

## 🎨 Theming

The application supports light and dark themes with system preference detection:

```tsx
import { ThemeProvider } from '@/components/theme-provider'

<ThemeProvider defaultTheme="system" storageKey="ui-theme">
  <App />
</ThemeProvider>
```

Theme preferences are automatically saved to localStorage.

## 📝 Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build |
| `npm run test` | Run test suite |
| `npm run storybook` | Start Storybook |
| `npm run build-storybook` | Build Storybook |
| `npm run deploy` | Build and deploy to Vercel |

## 🤝 Contributing

Contributions are welcome! Please:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Run tests (`npm test`)
5. Commit your changes (`git commit -m 'Add amazing feature'`)
6. Push to the branch (`git push origin feature/amazing-feature`)
7. Open a Pull Request

Please ensure your PR includes:
- Clear description of changes
- Tests for new functionality
- Updated documentation if needed

## 📄 License

MIT Licensed 2026 — See [LICENSE](./LICENSE) for details.

## 🔗 Links

- **Live Demo**: [lightningdecoder.com](https://lightningdecoder.com)
- **GitHub**: [github.com/andrerfneves/lightning-decoder](https://github.com/andrerfneves/lightning-decoder)
- **Issues**: [Report a bug](https://github.com/andrerfneves/lightning-decoder/issues)
- **LNURL Specs**: [github.com/lnurl/luds](https://github.com/lnurl/luds)
- **BOLT Specifications**: [github.com/lightning/bolts](https://github.com/lightning/bolts)

## 🙏 Acknowledgments

- [shadcn](https://twitter.com/shadcn) for the amazing UI component system
- [bitcoinjs-lib](https://github.com/bitcoinjs/bitcoinjs-lib) maintainers
- The Lightning Network community and specification authors
