## 1. Clerk post-auth redirect

- [x] 1.1 Configure SignIn component so fallback redirect after sign-in is `/app` (e.g. `fallbackRedirectUrl="/app"` or equivalent Clerk env var)
- [x] 1.2 Configure SignUp component so fallback redirect after sign-up is `/app` (e.g. `fallbackRedirectUrl="/app"` or equivalent Clerk env var)

## 2. Landing page redirect when signed in

- [x] 2.1 In the landing page (/) route, call auth() and redirect to `/app` when the user is authenticated; otherwise render the existing public landing content
