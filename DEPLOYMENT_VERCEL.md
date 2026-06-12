# Vercel Deployment

Lightning Decoder is optimized for deployment on Vercel, the platform created by the makers of Next.js.

## Quick Deploy

### Option 1: Deploy from GitHub

1. Push your code to a GitHub repository
2. Go to [vercel.com](https://vercel.com)
3. Click "Add New Project"
4. Import your GitHub repository
5. Vercel will auto-detect the Vite configuration
6. Click "Deploy"

### Option 2: Deploy with Vercel CLI

```bash
# Install Vercel CLI
npm install -g vercel

# Login to Vercel
vercel login

# Deploy to preview
vercel

# Deploy to production
vercel --prod
```

## Using npm Scripts

The project includes a deploy script:

```bash
# Build and deploy to production
npm run deploy
```

This runs `npm run build && vercel --prod`.

## Configuration

### vercel.json (Optional)

Create a `vercel.json` file in your project root for custom configuration:

```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "build",
  "devCommand": "npm run dev",
  "installCommand": "npm install"
}
```

### Environment Variables

No environment variables are required for the base application.

If you add features that require API keys or other secrets:

1. Go to your Vercel project dashboard
2. Navigate to Settings > Environment Variables
3. Add your variables
4. Redeploy your application

## Custom Domain

1. Go to your Vercel project dashboard
2. Navigate to Settings > Domains
3. Add your custom domain
4. Update your DNS records as instructed

## Automatic Deployments

Vercel automatically deploys:
- **Preview deployments** for every pull request
- **Production deployments** when you merge to main branch

## Troubleshooting

### Build fails on Vercel

Check the build logs in your Vercel dashboard. Common issues:

1. **Node.js version**: Vercel uses Node.js 18+ by default
2. **Dependency issues**: Clear the build cache in Vercel dashboard
3. **Memory limits**: Large builds may need increased memory

### 404 errors on page refresh

This is a common issue with single-page applications. Create a `vercel.json`:

```json
{
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```

### Performance optimization

Vercel automatically optimizes:
- Edge network delivery
- Asset compression
- Image optimization

For additional optimization, use Vercel Analytics:

```bash
npm install @vercel/analytics
```

Then add to your main component:

```tsx
import { Analytics } from '@vercel/analytics/react';

function App() {
  return (
    <>
      {/* Your app */}
      <Analytics />
    </>
  );
}
```
