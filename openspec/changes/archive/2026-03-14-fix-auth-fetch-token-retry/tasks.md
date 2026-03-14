## 1. Verify Clerk API

- [x] 1.1 Check `@clerk/nextjs` version in `web/package.json` and confirm `getToken({ skipCache: true })` is supported

## 2. Implement Retry Logic

- [x] 2.1 Update `authFetch` in `web/src/lib/api-client.ts` to retry once on 403 using `getToken({ skipCache: true })`

## 3. Verify

- [x] 3.1 Confirm no TypeScript errors in `api-client.ts`
- [x] 3.2 Manually trigger the scenario (reload app, watch server logs) and confirm 403s no longer appear
