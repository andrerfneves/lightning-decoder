# Deployment Guide

Lightning Decoder can be deployed to various platforms. This guide covers the most common options.

## Deployment Options

### 1. [Docker Deployment](./DEPLOYMENT_DOCKER.md) ⭐ Recommended

Deploy using Docker containers for maximum portability and consistency across environments.

- **Best for**: Production deployments, self-hosting, Kubernetes
- **Difficulty**: Easy
- **Time**: 5-10 minutes
- **Features**: Containerized, reproducible, scalable

[Get started with Docker →](./DEPLOYMENT_DOCKER.md)

### 2. [exe.dev Deployment](./DEPLOYMENT_EXEDEV.md)

Deploy to exe.dev VMs with built-in HTTPS proxies and zero configuration.

- **Best for**: Quick deployments, development, demos
- **Difficulty**: Very Easy
- **Time**: 2-5 minutes
- **Features**: Instant VMs, automatic HTTPS, public/private sharing

[Get started with exe.dev →](./DEPLOYMENT_EXEDEV.md)

### 3. [Vercel Deployment](./DEPLOYMENT_VERCEL.md)

Deploy to Vercel's edge network with automatic CI/CD and preview deployments.

- **Best for**: Production deployments, teams, automatic deployments
- **Difficulty**: Easy
- **Time**: 5-10 minutes
- **Features**: Edge network, preview deployments, analytics

[Get started with Vercel →](./DEPLOYMENT_VERCEL.md)

### 4. [Static Hosting](#static-hosting)

Deploy to any static hosting service (Netlify, GitHub Pages, Cloudflare Pages, etc.).

- **Best for**: Simple deployments, free hosting
- **Difficulty**: Easy
- **Time**: 5-15 minutes
- **Features**: Global CDN, free tier available

[Learn more about static hosting ↓](#static-hosting)

## Static Hosting

Since Lightning Decoder is a static site built with Vite, it can be deployed to any static hosting service:

### Build the project

```bash
npm run build
```

This creates a `build/` folder with the production build.

### Deploy the build folder

Upload the contents of `build/` to your hosting provider:

- **Netlify**: Drag and drop the `build/` folder to Netlify's deploy interface
- **GitHub Pages**: Push the `build/` contents to a `gh-pages` branch
- **Cloudflare Pages**: Connect your repository and set the build command to `npm run build` with output directory `build`
- **AWS S3 + CloudFront**: Upload `build/` to an S3 bucket and configure CloudFront for CDN delivery

### Environment Variables

No environment variables are required for the base application. All Lightning Network decoding happens client-side.

## Build for Production

```bash
npm run build
```

The optimized production build will be in the `build/` folder. All static hosting providers can serve this directory.

> **Note**: See [README.md](./README.md) for development, testing, and troubleshooting instructions.
