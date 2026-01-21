---
trigger: always_on
---

The "Golden" Tech StackWe strictly adhere to this stack. No deviations allowed.
|| Layer | Technology | Usage Policy 
|| Framework | Next.js| Use Server Components by default. Client Components only when interactivity is needed.
|| Language | TypeScript | Strict: true. The any type is forbidden. 
|| Styling | Tailwind CSS | No .css files. Use utility classes. 
|| UI Kit | Shadcn/UI | Use src/components/ui for all base elements. 
|| Backend | Supabase | PostgreSQL DB, Auth, Realtime subscriptions. 
|| Offline DB | Dexie.js / TanStack Query | For local data storage (Client-side caching). 
|| Deploy | Vercel | CI/CD pipeline. |