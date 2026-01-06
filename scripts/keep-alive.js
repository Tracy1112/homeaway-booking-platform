#!/usr/bin/env node

/**
 * Supabase Keep-Alive Script
 * 
 * This script pings Supabase API to keep the project active
 * and prevent it from being paused due to inactivity.
 * 
 * Run this script weekly using cron or a scheduler:
 * - Local: Add to crontab (0 0 * * 0 = every Sunday at midnight)
 * - GitHub Actions: Set up a scheduled workflow
 * - Vercel Cron: Use Vercel Cron Jobs
 */

// Try to load dotenv if available (optional, for local development)
// In GitHub Actions, environment variables are provided via secrets
try {
  const dotenv = require('dotenv');
  dotenv.config({ path: '.env.local' });
} catch (e) {
  // dotenv not installed, that's fine - use process.env directly
}

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_KEY;

if (!SUPABASE_URL || !SUPABASE_KEY) {
  console.error('❌ Error: SUPABASE_URL and SUPABASE_KEY must be set in .env.local');
  process.exit(1);
}

// Extract project reference from URL
const projectRef = SUPABASE_URL.match(/https:\/\/([^.]+)\.supabase\.co/)?.[1];

if (!projectRef) {
  console.error('❌ Error: Invalid SUPABASE_URL format');
  process.exit(1);
}

async function keepAlive() {
  const timestamp = new Date().toISOString();
  console.log(`\n🔄 [${timestamp}] Keeping Supabase project alive...`);

  try {
    // Ping Supabase REST API to keep project active
    const response = await fetch(`${SUPABASE_URL}/rest/v1/`, {
      method: 'GET',
      headers: {
        'apikey': SUPABASE_KEY,
        'Authorization': `Bearer ${SUPABASE_KEY}`,
      },
    });

    if (response.ok || response.status === 404) {
      // 404 is fine - it means the endpoint exists but we're just pinging
      console.log(`✅ Successfully pinged Supabase project: ${projectRef}`);
      console.log(`   Status: ${response.status}`);
      return true;
    } else {
      console.warn(`⚠️  Unexpected status: ${response.status}`);
      return false;
    }
  } catch (error) {
    console.error(`❌ Error pinging Supabase:`, error.message);
    
    // Check if project might be paused
    if (error.message.includes('ECONNREFUSED') || error.message.includes('502')) {
      console.error(`\n⚠️  Project might be paused. Please resume it from:`);
      console.error(`   https://supabase.com/dashboard/project/${projectRef}`);
    }
    
    return false;
  }
}

// Run the keep-alive function
keepAlive()
  .then((success) => {
    if (success) {
      console.log('\n✨ Keep-alive completed successfully!\n');
      process.exit(0);
    } else {
      console.log('\n⚠️  Keep-alive completed with warnings\n');
      process.exit(1);
    }
  })
  .catch((error) => {
    console.error('\n❌ Fatal error:', error);
    process.exit(1);
  });

