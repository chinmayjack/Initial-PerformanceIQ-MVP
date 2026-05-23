# PerformanceIQ Deployment

Recommended first production stack:

- App hosting: Vercel
- Database: Neon or Supabase Postgres
- Secrets: Vercel environment variables
- AI: OpenAI API key

## Vercel Steps

1. Push this repo to GitHub.
2. Create a new Vercel project from the repo.
3. Add environment variables:

```env
DATABASE_URL="postgresql://..."
DIRECT_URL="postgresql://..."
OPENAI_API_KEY="sk-..."
OPENAI_REVIEW_MODEL="gpt-4o-mini"
NEXT_PUBLIC_APP_URL="https://your-domain.com"
```

4. Run database migration against the hosted database:

```bash
npx prisma migrate deploy
npm run prisma:seed
```

5. Deploy:

```bash
npx vercel --prod
```

## If Vercel Build Fails After `npm install`

Make sure all environment variables are added for **Production**:

```env
DATABASE_URL=postgresql://postgres.owplfnvqevwwtgbghgyb:YOUR_DATABASE_PASSWORD@aws-1-us-west-2.pooler.supabase.com:6543/postgres?pgbouncer=true&connection_limit=1
DIRECT_URL=postgresql://postgres.owplfnvqevwwtgbghgyb:YOUR_DATABASE_PASSWORD@aws-1-us-west-2.pooler.supabase.com:5432/postgres
OPENAI_API_KEY=
OPENAI_REVIEW_MODEL=gpt-4o-mini
NEXT_PUBLIC_APP_URL=https://YOUR_VERCEL_APP_NAME.vercel.app
```

Then redeploy with **Redeploy without build cache**.

The project explicitly runs `prisma generate` during install and build so Vercel has a fresh Prisma Client.

## Production Checklist

- Pilot login is available at `/login` and stores the selected workspace/user in secure HTTP-only cookies.
- Replace the pilot login with Google/Microsoft SSO before real customer data is used.
- Use a hosted Postgres database with backups enabled.
- Add a privacy policy, terms, and security overview to the public site.
- Restrict seed scripts from running against production customer data.
- Add monitoring for API errors and AI generation failures.

## Login Smoke Test

After deployment:

1. Open `/dashboard`.
2. You should be redirected to `/login`.
3. Select `Acme Health Systems`.
4. Select a seeded user such as `Ava Patel`.
5. Click **Enter workspace**.
6. Confirm `/dashboard`, `/reviews`, `/workspace`, and `/analytics` load.
7. Click **Sign out** in the top bar and confirm you return to `/login`.
