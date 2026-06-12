# exe.dev Deployment

[exe.dev](https://exe.dev) provides instant VMs with built-in HTTPS proxies, making it perfect for deploying Lightning Decoder with zero configuration.

## Prerequisites

- An exe.dev account ([sign up](https://exe.dev))
- SSH access to exe.dev (`ssh exe.dev`)

## Quick Deploy

### 1. Create a VM

```bash
# Create a new VM
ssh exe.dev new lightning-decoder

# Or specify a region
ssh exe.dev new lightning-decoder --region us-west
```

### 2. Connect and Setup

```bash
# SSH into your VM
ssh lightning-decoder.exe.xyz

# Clone the repository
git clone https://github.com/yourusername/lightning-decoder.git
cd lightning-decoder

# Install dependencies
npm install
```

### 3. Configure Vite for exe.dev

Update `vite.config.js` to allow requests from your exe.dev hostname:

```typescript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',
    port: 5173,
    allowedHosts: ['lightning-decoder.exe.xyz'],
  },
});
```

### 4. Run Development Server

```bash
npm run dev
```

Your app is now accessible at: `https://lightning-decoder.exe.xyz:5173`

## Production Deployment

For production, build and serve the static files:

### Option 1: Using Vite Preview

```bash
# Build the app
npm run build

# Update vite.config.js for preview server
# Add preview configuration:
```

```typescript
export default defineConfig({
  // ... existing config
  preview: {
    host: '0.0.0.0',
    port: 4173,
    allowedHosts: ['lightning-decoder.exe.xyz'],
  },
});
```

```bash
# Start preview server
npm run preview
```

Accessible at: `https://lightning-decoder.exe.xyz:4173`

### Option 2: Using Docker (Recommended)

If you have Docker installed on your VM:

```bash
# Build and run with Docker Compose
docker-compose up -d

# The app will be available on port 80
```

Accessible at: `https://lightning-decoder.exe.xyz`

### Option 3: Using a Static File Server

```bash
# Build the app
npm run build

# Install a simple HTTP server
npm install -g serve

# Serve the build directory
serve -s build -l 3000
```

Accessible at: `https://lightning-decoder.exe.xyz:3000`

## Configuring the Proxy

### Change the Default Port

By default, exe.dev proxies to the most appropriate port. To explicitly set it:

```bash
# Set proxy to port 5173 (Vite dev server)
ssh exe.dev share port lightning-decoder 5173

# Set proxy to port 4173 (Vite preview)
ssh exe.dev share port lightning-decoder 4173

# Set proxy to port 80 (Docker/nginx)
ssh exe.dev share port lightning-decoder 80
```

### Make Public or Private

By default, your deployment is private (requires exe.dev login):

```bash
# Make publicly accessible
ssh exe.dev share set-public lightning-decoder

# Return to private access
ssh exe.dev share set-private lightning-decoder
```

## Using PM2 for Process Management

For long-running production deployments, use PM2:

```bash
# Install PM2
npm install -g pm2

# Start the app with PM2
pm2 start npm --name "lightning-decoder" -- run preview

# Or for development
pm2 start npm --name "lightning-decoder" -- run dev

# Save PM2 configuration
pm2 save

# Set up PM2 to start on boot
pm2 startup
```

### PM2 Commands

```bash
# View status
pm2 status

# View logs
pm2 logs lightning-decoder

# Restart
pm2 restart lightning-decoder

# Stop
pm2 stop lightning-decoder
```

## Custom Domain

To use your own domain instead of `*.exe.xyz`:

```bash
# Register your domain
ssh exe.dev domain add lightning-decoder example.com

# Update your DNS to point to exe.dev
# (instructions provided by the command above)
```

See [Custom Domains](https://exe.dev/docs/cnames) for detailed instructions.

## Environment Variables

Set environment variables for your deployment:

```bash
# In your VM shell
export NODE_ENV=production

# Or create a .env file
cat > .env << EOF
NODE_ENV=production
VITE_API_URL=https://api.example.com
EOF
```

## Updating Your Deployment

```bash
# SSH into your VM
ssh lightning-decoder.exe.xyz

# Pull latest changes
cd lightning-decoder
git pull origin main

# Reinstall dependencies (if package.json changed)
npm install

# Rebuild (for production)
npm run build

# Restart PM2 (if using PM2)
pm2 restart lightning-decoder

# Or restart Docker
docker-compose restart
```

## Monitoring

### View Logs

```bash
# PM2 logs
pm2 logs lightning-decoder

# Docker logs
docker-compose logs -f

# System logs
journalctl -u lightning-decoder
```

### Check Status

```bash
# PM2 status
pm2 status

# Docker status
docker-compose ps

# Port availability
netstat -tlnp | grep -E '5173|4173|80|3000'
```

## Troubleshooting

### "Host not allowed" Error

If you see this error, update `vite.config.js`:

```typescript
server: {
  allowedHosts: ['lightning-decoder.exe.xyz'],
},
```

Then restart the dev server.

### Port Not Accessible

Check if the port is in the allowed range (3000-9999 for additional ports):

```bash
# Check what's listening
netstat -tlnp

# Restart your server
pm2 restart lightning-decoder
```

### Proxy Not Working

Verify the proxy configuration:

```bash
# Check current proxy port
ssh exe.dev share port lightning-decoder

# Reset proxy
ssh exe.dev share port lightning-decoder 5173
```

### Permission Denied

Make sure you're running as the correct user:

```bash
whoami
# Should be your exe.dev username, not root
```

## Security Considerations

1. **Private by Default**: Your deployment is private until you explicitly make it public
2. **HTTPS Only**: All traffic is encrypted with TLS
3. **Firewall**: exe.dev handles firewall rules automatically
4. **Updates**: Keep your dependencies updated:

```bash
npm audit
npm update
```

## Cost

exe.dev VMs are billed by the hour. Check current pricing at [exe.dev](https://exe.dev).

To stop billing:

```bash
# Stop the VM (keeps data)
ssh exe.dev stop lightning-decoder

# Or delete the VM entirely
ssh exe.dev rm lightning-decoder
```

## Additional Resources

- [exe.dev Documentation](https://exe.dev/docs)
- [HTTP Proxy Guide](https://exe.dev/docs/proxy)
- [Custom Domains](https://exe.dev/docs/cnames)
- [Sharing Access](https://exe.dev/docs/sharing)

## Example: Complete Setup Script

```bash
#!/bin/bash
# setup-exedev.sh - Run this on your exe.dev VM

# Clone repository
git clone https://github.com/yourusername/lightning-decoder.git
cd lightning-decoder

# Install dependencies
npm install

# Install PM2
npm install -g pm2

# Build for production
npm run build

# Start with PM2
pm2 start npm --name "lightning-decoder" -- run preview

# Save PM2 configuration
pm2 save

# Set up startup
pm2 startup

echo "Setup complete! Your app is running at:"
echo "https://$(hostname):4173"
```

Run this script on your VM for a complete automated setup.
