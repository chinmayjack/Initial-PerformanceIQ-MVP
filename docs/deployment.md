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

## Production Checklist

- Add a real auth provider before customer data is used.
- Replace `lib/session.ts` with authenticated organization and user resolution.
- Use a hosted Postgres database with backups enabled.
- Add a privacy policy, terms, and security overview to the public site.
- Restrict seed scripts from running against production customer data.
- Add monitoring for API errors and AI generation failures.
