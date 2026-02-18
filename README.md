# Star Wars Planet Explorer

## Purpose & Design choices

Purpose of this project is to show skills with React, TypeScript and Next.js.

### Globa State Management

This project is using pure React Context API for demonstration purposes.

For RESTful resource, better alternatives are for example
[Tanstack's React Query](https://tanstack.com/query/v5/docs/framework/react/overview) or
[React Redux](https://react-redux.js.org/)

## API Notes

There are at least two choices:

- ✅ [swapi.info](https://swapi.info/) (in use)
  - ❌ Missing pagination & search
  - ✅ JSON Schema
- ❌ [swapi.dev](https://swapi.dev/)
  - ✅ Have pagination & search
  - ❌ JSON Schema not working, see
    [#37](https://github.com/Juriy/swapi/issues/37),
    [⎇66](https://github.com/Juriy/swapi/pull/66)

## Types are generated from JSON Schema

You can run `pnpm gen:types:planet` which will effectively run this:

```bash
curl https://swapi.info/api/planets/schema \
| pnpx json-schema-to-valibot -t --name Planet \
| pnpx prettier --parser typescript \
> types/planet.ts
```

## Developer guidelines

- Use [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/#specification) convention for commit messages
- Do not introduce new dependencies

---

---

# Next framework

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
