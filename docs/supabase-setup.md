# Supabase Setup for PerformanceIQ

Project dashboard:

```text
https://supabase.com/dashboard/project/owplfnvqevwwtgbghgyb
```

## Get The Connection Strings

1. Open your Supabase project.
2. Go to **Project Settings**.
3. Go to **Database**.
4. Find **Connection string**.
5. Copy two strings:
   - **Transaction pooler** for `DATABASE_URL`
   - **Session pooler** or direct connection for `DIRECT_URL`
6. Replace `[YOUR-PASSWORD]` with the database password you created.

## Local `.env`

Use this shape:

```env
DATABASE_URL="postgresql://postgres.owplfnvqevwwtgbghgyb:YOUR_DATABASE_PASSWORD@aws-0-REGION.pooler.supabase.com:6543/postgres?pgbouncer=true&connection_limit=1"
DIRECT_URL="postgresql://postgres.owplfnvqevwwtgbghgyb:YOUR_DATABASE_PASSWORD@aws-0-REGION.pooler.supabase.com:5432/postgres"
OPENAI_API_KEY=""
OPENAI_REVIEW_MODEL="gpt-4o-mini"
NEXT_PUBLIC_APP_URL="http://localhost:3010"
```

Your exact host and region may differ. Copy them from Supabase rather than guessing.

## Apply Schema And Seed Data

After `.env` has the Supabase URL:

```bash
npx prisma migrate deploy
npm run prisma:seed
```

Then run the app:

```bash
npm run dev -- -p 3010
```

Open:

```text
http://localhost:3010
```

## Vercel Environment Variables

Add these in Vercel project settings:

```env
DATABASE_URL="your Supabase transaction pooler URI"
DIRECT_URL="your Supabase session/direct URI"
OPENAI_API_KEY="your OpenAI key"
OPENAI_REVIEW_MODEL="gpt-4o-mini"
NEXT_PUBLIC_APP_URL="https://your-vercel-domain.vercel.app"
```

## Important

- Do not use the Supabase anon key as `DATABASE_URL`.
- Do not paste the service role key into frontend code.
- Use the database password, not your Supabase account password.
- If the password has special characters like `@`, `#`, `/`, or `:`, URL-encode it before putting it in the connection string.
