# Deployment Guide

This guide covers various deployment options for the file upload frontend application.

## Prerequisites

Before deploying, ensure you have:

- Node.js 18+ installed
- A backend API running (gRPC server + REST gateway)
- Environment variables configured
- Domain/URL for production deployment

## Environment Configuration

### Development
Create `.env.local`:
```env
NEXT_PUBLIC_API_URL=http://localhost:8080
```

### Production
Create `.env.production`:
```env
NEXT_PUBLIC_API_URL=https://your-api-domain.com
```

## Deployment Options

### 1. Vercel (Recommended)

Vercel provides seamless Next.js deployment with automatic builds and deployments.

#### Setup Steps:

1. **Connect Repository**:
   - Go to [vercel.com](https://vercel.com)
   - Import your Git repository
   - Vercel will auto-detect Next.js configuration

2. **Configure Environment Variables**:
   - Go to Project Settings → Environment Variables
   - Add `NEXT_PUBLIC_API_URL` with your production API URL

3. **Deploy**:
   - Push to your main branch
   - Vercel automatically builds and deploys
   - Get your production URL

#### Vercel Configuration (`vercel.json`):
```json
{
  "buildCommand": "npm run build",
  "outputDirectory": ".next",
  "framework": "nextjs",
  "env": {
    "NEXT_PUBLIC_API_URL": "@api-url"
  }
}
```

### 2. Netlify

Netlify provides static site hosting with build automation.

#### Setup Steps:

1. **Build Configuration** (`netlify.toml`):
```toml
[build]
  command = "npm run build"
  publish = ".next"

[build.environment]
  NODE_VERSION = "18"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

2. **Deploy**:
   - Connect your Git repository
   - Set build command: `npm run build`
   - Set publish directory: `.next`
   - Add environment variables

### 3. Docker Deployment

Create a Dockerfile for containerized deployment:

```dockerfile
# Dockerfile
FROM node:18-alpine AS base

# Install dependencies only when needed
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Install dependencies
COPY package.json package-lock.json* ./
RUN npm ci

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Build the application
RUN npm run build

# Production image, copy all the files and run next
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public

# Set the correct permission for prerender cache
RUN mkdir .next
RUN chown nextjs:nodejs .next

# Automatically leverage output traces to reduce image size
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT 3000
ENV HOSTNAME "0.0.0.0"

CMD ["node", "server.js"]
```

#### Build and Run:
```bash
# Build the image
docker build -t upload-frontend .

# Run the container
docker run -p 3000:3000 -e NEXT_PUBLIC_API_URL=https://your-api.com upload-frontend
```

### 4. AWS Amplify

AWS Amplify provides full-stack deployment with CI/CD.

#### Setup Steps:

1. **Connect Repository**:
   - Go to AWS Amplify Console
   - Connect your Git repository
   - Select Next.js framework

2. **Build Settings** (`amplify.yml`):
```yaml
version: 1
frontend:
  phases:
    preBuild:
      commands:
        - npm ci
    build:
      commands:
        - npm run build
  artifacts:
    baseDirectory: .next
    files:
      - '**/*'
  cache:
    paths:
      - node_modules/**/*
      - .next/cache/**/*
```

3. **Environment Variables**:
   - Add `NEXT_PUBLIC_API_URL` in Amplify console
   - Configure build settings

### 5. Traditional Server Deployment

For deployment on traditional servers (VPS, dedicated servers):

#### Build Process:
```bash
# Install dependencies
npm ci

# Build the application
npm run build

# Start production server
npm start
```

#### Nginx Configuration:
```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

## Performance Optimization

### Build Optimization

1. **Enable Static Generation**:
```typescript
// next.config.ts
const nextConfig = {
  output: 'export', // For static export
  trailingSlash: true,
  images: {
    unoptimized: true
  }
}
```

2. **Bundle Analysis**:
```bash
npm install --save-dev @next/bundle-analyzer
```

3. **Image Optimization**:
```typescript
import Image from 'next/image'

// Use Next.js Image component for optimized images
<Image
  src="/logo.png"
  alt="Logo"
  width={200}
  height={100}
  priority
/>
```

### Runtime Optimization

1. **Enable Compression**:
```typescript
// next.config.ts
const nextConfig = {
  compress: true,
  poweredByHeader: false
}
```

2. **Caching Headers**:
```typescript
// next.config.ts
const nextConfig = {
  async headers() {
    return [
      {
        source: '/static/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ]
  },
}
```

## Security Considerations

### Environment Variables
- Never commit `.env` files to version control
- Use secure environment variable management
- Rotate API keys regularly

### HTTPS
- Always use HTTPS in production
- Configure SSL certificates
- Enable HSTS headers

### Content Security Policy
```typescript
// next.config.ts
const nextConfig = {
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: "default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline'; style-src 'self' 'unsafe-inline';"
          }
        ]
      }
    ]
  }
}
```

## Monitoring and Analytics

### Error Tracking
```bash
npm install @sentry/nextjs
```

### Performance Monitoring
```bash
npm install @vercel/analytics
```

### Health Checks
Create a health check endpoint:
```typescript
// app/api/health/route.ts
export async function GET() {
  return Response.json({ status: 'ok', timestamp: new Date().toISOString() })
}
```

## Troubleshooting

### Common Issues

1. **Build Failures**:
   - Check Node.js version compatibility
   - Clear `.next` cache: `rm -rf .next`
   - Reinstall dependencies: `rm -rf node_modules && npm install`

2. **Runtime Errors**:
   - Check environment variables
   - Verify API connectivity
   - Check browser console for errors

3. **Performance Issues**:
   - Enable bundle analysis
   - Check for memory leaks
   - Optimize images and assets

### Debug Mode
```bash
# Enable debug logging
DEBUG=* npm run dev

# Check build output
npm run build -- --debug
```

## Rollback Strategy

### Vercel
- Use Vercel's deployment history
- One-click rollback to previous versions

### Docker
```bash
# Tag previous version
docker tag upload-frontend:latest upload-frontend:previous

# Rollback
docker run -p 3000:3000 upload-frontend:previous
```

### Git-based
```bash
# Revert to previous commit
git revert HEAD
git push origin main
```

## Backup and Recovery

### Code Backup
- Use Git for version control
- Regular pushes to remote repository
- Tag releases for easy rollback

### Data Backup
- Backup uploaded files
- Database backups for metadata
- Configuration file backups

## Scaling Considerations

### Horizontal Scaling
- Use load balancers
- Multiple server instances
- CDN for static assets

### Vertical Scaling
- Increase server resources
- Optimize database queries
- Cache frequently accessed data

### Database Scaling
- Read replicas for metadata
- Connection pooling
- Query optimization

