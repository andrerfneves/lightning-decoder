# Lightning Decoder

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Built with Vite](https://img.shields.io/badge/Built%20with-Vite-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
[![React 19](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white)](https://react.dev/)

> [https://lightningdecoder.com](https://lightningdecoder.com)

![Image of Lightning Decoder](https://i.imgur.com/mg6opec.png)

Lightning Decoder is a developer utility for parsing and understanding Lightning Network payment data. Built for developers working in the Bitcoin/Lightning ecosystem.

## Features

- **BOLT11 Invoice Decoding** — Parse Lightning Network invoices to view amount, description, expiry, payment hash, routing hints, and other encoded fields
- **LNURL Decoding** — Decode [LNURL](https://github.com/lnurl/luds) requests (lnurl-pay, lnurl-withdraw, lnurl-auth, lnurl-channel) to inspect the underlying callback URLs and parameters
- **Lightning Address Resolution** — Resolve Lightning Addresses (user@domain.com) to their LNURL-pay endpoints
- **QR Code Scanning** — Scan QR codes directly from your camera to decode Lightning payment data

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

The app will be available at `http://localhost:5173`.

### Production Build

```bash
# Build for production
npm run build

# Preview production build locally
npm run preview
```

Output is generated in the `/dist` directory.

## Tech Stack

- [React 19](https://react.dev/) — UI framework
- [Vite](https://vitejs.dev/) — Build tool and dev server
- [bitcoinjs-lib](https://github.com/bitcoinjs/bitcoinjs-lib) — Bitcoin library for BOLT11 decoding
- [bech32](https://github.com/bitcoinjs/bech32) — Bech32 encoding/decoding for LNURL

## Contributing

Contributions are welcome. If you find a bug or want to add a feature, please open a PR with a clear description of the changes.

## License

MIT Licensed 2026

