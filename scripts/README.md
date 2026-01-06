# Scripts Directory

## keep-alive.js

A simple script to keep your Supabase project active and prevent it from being paused due to inactivity.

### Usage

#### Manual Run

```bash
# Make sure you have SUPABASE_URL and SUPABASE_KEY in .env.local
npm run keep-alive
```

#### Automated with GitHub Actions (Recommended)

1. **Add Secrets to GitHub**:
   - Go to your repository → Settings → Secrets and variables → Actions
   - Add `SUPABASE_URL` secret
   - Add `SUPABASE_KEY` secret

2. **Workflow is already configured**:
   - The workflow runs automatically every Sunday at 00:00 UTC
   - You can also trigger it manually from Actions tab

3. **Verify it's working**:
   - Check the Actions tab after the first run
   - You should see a successful run

#### Automated with Local Cron (Alternative)

If you prefer to run it locally:

```bash
# Edit crontab
crontab -e

# Add this line to run every Sunday at midnight
0 0 * * 0 cd /path/to/your/project && npm run keep-alive >> /tmp/supabase-keep-alive.log 2>&1
```

#### Using Vercel Cron Jobs

If your project is deployed on Vercel, you can use Vercel Cron:

1. Create `vercel.json`:
```json
{
  "crons": [{
    "path": "/api/keep-alive",
    "schedule": "0 0 * * 0"
  }]
}
```

2. Create `app/api/keep-alive/route.ts`:
```typescript
import { keepAlive } from '@/scripts/keep-alive';

export async function GET() {
  const success = await keepAlive();
  return Response.json({ success }, { status: success ? 200 : 500 });
}
```

### How It Works

The script:
1. Reads `SUPABASE_URL` and `SUPABASE_KEY` from environment variables
2. Pings the Supabase REST API endpoint
3. Keeps the project active (prevents 7-day inactivity pause)
4. Provides clear success/error messages

### Requirements

- Node.js 18+
- `SUPABASE_URL` and `SUPABASE_KEY` environment variables
- Network access to Supabase API

### Notes

- Free tier projects pause after **7 days** of inactivity
- Running this script **weekly** is sufficient to keep the project active
- The script is lightweight and won't consume significant resources
- If the project is already paused, the script will detect and report it

