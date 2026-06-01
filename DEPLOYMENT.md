# Deployment Guide

Lightning Decoder can be deployed to various platforms. This guide covers the most common options.

## Table of Contents

- [Vercel Deployment](./DEPLOYMENT_VERCEL.md)
- [Docker Deployment](./DEPLOYMENT_DOCKER.md)
- [Static Hosting](#static-hosting)

## Static Hosting

Since Lightning Decoder is a static site built with Vite, it can be deployed to any static hosting service:

### Build the project

```bash
npm run build
```

This creates a `dist/` folder with the production build.

### Deploy the dist folder

Upload the contents of `dist/` to your hosting provider:

- **Netlify**: Drag and drop the `dist/` folder to Netlify's deploy interface
- **GitHub Pages**: Push the `dist/` contents to a `gh-pages` branch
- **Cloudflare Pages**: Connect your repository and set the build command to `npm run build` with output directory `dist`
- **AWS S3 + CloudFront**: Upload `dist/` to an S3 bucket and configure CloudFront for CDN delivery

### Environment Variables

No environment variables are required for the base application. All Lightning Network decoding happens client-side.

## Development

### Local Development

```bash
npm install
npm run dev
```

The app will be available at `http://localhost:5173`

### Storybook

```bash
npm run storybook
```

Storybook will be available at `http://localhost:6006`

### Testing

```bash
npm test
```

Run the test suite with Vitest.

## Build for Production

```bash
npm run build
```

The optimized production build will be in the `dist/` folder.

## Troubleshooting

### Build fails with dependency errors

Make sure you're using Node.js 18 or higher:

```bash
node --version
```

If you need to upgrade Node.js, use a version manager like nvm.

### Storybook not loading

Clear the Storybook cache:

```bash
rm -rf node_modules/.cache/storybook
npm run storybook
```

### Tests failing

Make sure all dependencies are installed:

```bash
npm install
npm test
```
