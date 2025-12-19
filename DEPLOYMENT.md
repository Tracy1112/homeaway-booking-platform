# 🚀 Deployment Guide

## Vercel Deployment (Recommended)

Vercel is created by the Next.js team and provides the best Next.js deployment experience.

### Steps

1. **Prepare Code Repository**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin <your-github-repo>
   git push -u origin main
   ```

2. **Import Project to Vercel**
   - Visit [vercel.com](https://vercel.com)
   - Click "New Project"
   - Import your GitHub repository

3. **Configure Environment Variables**
   Add all environment variables in Vercel project settings:
   - `DATABASE_URL`
   - `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
   - `CLERK_SECRET_KEY`
   - `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
   - `STRIPE_SECRET_KEY`
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `ADMIN_USER_ID`

4. **Configure Build Command**
   Vercel automatically detects Next.js projects, but ensure the build command is:
   ```json
   "build": "npx prisma generate && next build"
   ```

5. **Deploy**
   - Click "Deploy"
   - Wait for the build to complete
   - Visit the provided URL

### Database Setup

#### MongoDB Atlas (Recommended)

1. Create a MongoDB Atlas account
2. Create a cluster
3. Get the connection string
4. Set `DATABASE_URL` in Vercel environment variables

#### Run Database Migrations

After deployment, you need to run in production:
```bash
npx prisma db push
```

Or use Vercel's post-build scripts.

---

## Other Deployment Options

### Netlify

1. Import GitHub repository
2. Configure environment variables
3. Set build command: `npm run build`
4. Set publish directory: `.next`

### Railway

1. Connect GitHub repository
2. Configure environment variables
3. Railway automatically detects Next.js and deploys

### Docker Deployment

Create `Dockerfile`:

```dockerfile
FROM node:18-alpine AS base

# Install dependencies only when needed
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

RUN npx prisma generate
RUN npm run build

# Production image, copy all the files and run next
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT 3000

CMD ["node", "server.js"]
```

Add to `next.config.mjs`:
```javascript
output: 'standalone',
```

---

## Environment Variable Management

### Development Environment
Use `.env.local` file (already added to `.gitignore`)

### Production Environment
- Vercel: Project Settings → Environment Variables
- Other platforms: Respective environment variable configuration interface

### Security Best Practices

1. ✅ Never commit `.env.local` to Git
2. ✅ Use different keys for development and production
3. ✅ Rotate keys regularly
4. ✅ Use key management services (like Vercel's environment variables)

---

## Domain Configuration

### Custom Domain

1. Add domain in Vercel project settings
2. Follow the prompts to configure DNS records
3. Wait for SSL certificate to be automatically configured

---

## Monitoring and Logging

### Recommended Tools

1. **Vercel Analytics**: Built-in performance monitoring
2. **Sentry**: Error tracking
3. **LogRocket**: Session replay and error tracking

### Sentry Integration Example

```bash
npm install @sentry/nextjs
npx @sentry/wizard@latest -i nextjs
```

---

## Performance Optimization

### Production Checklist

- [ ] Enable Next.js Image optimization
- [ ] Configure CDN (automatically provided by Vercel)
- [ ] Enable compression
- [ ] Configure caching strategies
- [ ] Monitor performance metrics

### Lighthouse Score Targets

- Performance: 90+
- Accessibility: 90+
- Best Practices: 90+
- SEO: 90+

---

## Troubleshooting

### Common Issues

1. **Build Failures**
   - Check if environment variables are complete
   - Check if Prisma generation succeeded
   - Review build logs

2. **Database Connection Failures**
   - Check if `DATABASE_URL` is correct
   - Check MongoDB Atlas IP whitelist
   - Check network connection

3. **Authentication Issues**
   - Check if Clerk keys are correct
   - Check Clerk callback URL configuration

4. **Payment Issues**
   - Check Stripe keys
   - Check Stripe webhook configuration

---

## Rollback Strategy

### Vercel Rollback

1. Go to project deployment history
2. Select a previous successful deployment
3. Click "Promote to Production"

### Database Migration Rollback

```bash
npx prisma migrate resolve --rolled-back <migration_name>
```

---

## Continuous Integration/Continuous Deployment (CI/CD)

Use GitHub Actions for automatic deployment (see `.github/workflows/ci.yml`)

---

**Tip**: For the first deployment, it's recommended to test in a staging environment first, and only deploy to production after confirming everything works correctly.
