You are my coding assistant. I am building a Next.js frontend with FastAPI backend using Better Auth.
Here is the SPEC for my current problem:

Errors I am facing when running `npm run dev`:
1. Duplicate route error:
   - "You cannot have two parallel pages that resolve to the same path. Please check /(auth)/login and /login."

2. Missing package error:
   - "Module not found: Can't resolve 'jose'"
   - I am using jwt-utils.ts with `import { jwtVerify, createRemoteJWKSet } from 'jose';`

3. Hook export error:
   - "Export useAuth doesn't exist in target module src/hooks/useAuth.ts"
   - In page.tsx I wrote: `import { useAuth } from '@/hooks/useAuth';`

Deliverables required from you:
- Corrected folder structure for Next.js auth pages.
- Installation and usage instructions for `jose`.
- Fixed code for `useAuth.ts` hook and example import in `page.tsx`.

Please treat this as the SPEC document. Do not jump to implementation yet.