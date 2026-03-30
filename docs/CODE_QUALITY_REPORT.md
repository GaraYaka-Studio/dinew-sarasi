# Code Quality Tools Report

**Date**: 2026-03-30
**Status**: ⚠️ **NOT OK - Critical Issues Found**

---

## Summary

| Tool | Status | Issues |
|------|--------|--------|
| ESLint | ❌ FAILING | 6 errors, 30+ warnings |
| Prettier | ✅ OK | Configured correctly |
| Husky Pre-commit | ⚠️ BROKEN | Hook exists but no script |
| Vitest (Unit Tests) | ✅ PASSING | 1/1 tests pass |
| Playwright (E2E Tests) | ❌ FAILING | Missing env vars in CI |
| GitHub Actions | ❌ BLOCKED | ESLint errors + missing secrets |

---

## GitHub Actions CI Failure Analysis

### E2E Test Failure Root Cause

**Error**: `Your project's URL and Key are required to create a Supabase client!`

**Location**: [src/middleware.ts:14-16](src/middleware.ts#L14-L16)

```typescript
const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,  // ← Crashes here (undefined!)
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    // ...
);
```

**Problem**:
1. `.env.example` only contains `DATABASE_URL` - missing Supabase variables
2. GitHub Actions doesn't have `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` secrets
3. Middleware uses `!` (non-null assertion) which throws when env vars are undefined
4. Dev server crashes, so Playwright can't run tests

### ESLint Failure in CI

**Same 6 errors** as local (blocking CI):
- `scripts/create-super-admin.ts:60` - `any` type
- `src/app/api/auth/login/route.ts:68` - `any` type
- `src/app/api/auth/logout/route.ts:26` - `any` type
- `src/app/dashboard/attendance/scan/page.tsx:43` - `any` type
- `src/app/dashboard/attendance/scan/page.tsx:121` - variable before declaration
- `src/app/dashboard/attendance/scan/page.tsx:213` - variable before declaration

---

## 1. ESLint - ❌ FAILING

### Configuration
**File**: [eslint.config.mjs](eslint.config.mjs)
- Uses `eslint-config-next` with TypeScript and Core Web Vitals
- Prettier integration enabled
- **Status**: Config is correct, but code has errors

### Critical Errors (Must Fix)

| File | Line | Issue | Severity |
|------|------|-------|----------|
| [scripts/create-super-admin.ts](scripts/create-super-admin.ts#L60) | 60 | `any` type used | 🔴 Error |
| [src/app/api/auth/login/route.ts](src/app/api/auth/login/route.ts#L68) | 68 | `any` type used | 🔴 Error |
| [src/app/api/auth/logout/route.ts](src/app/api/auth/logout/route.ts#L26) | 26 | `any` type used | 🔴 Error |
| [src/app/dashboard/attendance/scan/page.tsx](src/app/dashboard/attendance/scan/page.tsx#L121) | 121 | Variable accessed before declaration | 🔴 Error |
| [src/app/dashboard/attendance/scan/page.tsx](src/app/dashboard/attendance/scan/page.tsx#L213) | 213 | Variable accessed before declaration | 🔴 Error |
| [src/app/dashboard/attendance/scan/page.tsx](src/app/dashboard/attendance/scan/page.tsx#L43) | 43 | `any` type used | 🔴 Error |

### Warnings (30+)

**Unused Variables:**
- `src/app/api/qr/scan/route.ts:4` - `isNull` imported but not used
- `src/app/dashboard/academics/classes/page.tsx:32` - `isLoading` declared but not used
- `src/app/dashboard/academics/timetable/page.tsx:3,10,64` - Multiple unused imports/variables
- `src/app/dashboard/attendance/log/page.tsx:34` - `getCurrentDate` not used
- `src/app/dashboard/attendance/scan/page.tsx:14` - `StudentAttendanceData` not used

**React Hooks Dependencies:**
- `src/app/dashboard/academics/timetable/page.tsx:77` - Missing `loadSessions` in useEffect deps
- `src/app/dashboard/attendance/log/page.tsx:53` - Missing `loadAttendance` in useEffect deps
- `src/app/dashboard/attendance/scan/page.tsx:123` - Missing `loadAttendanceCount` in useEffect deps
- `src/app/dashboard/attendance/scan/page.tsx:136` - `setTimeout` callback violates immutability

---

## 2. Prettier - ✅ OK

### Configuration
**File**: [.prettierrc](.prettierrc)
```json
{
  "tabWidth": 4,
  "singleQuote": true,
  "trailingComma": "es5",
  "plugins": ["prettier-plugin-tailwindcss"],
  "tailwindStylesheet": "./src/app/globals.css"
}
```

**Status**: Configuration is correct and appropriate for the project.

---

## 3. Husky Pre-commit Hooks - ⚠️ BROKEN

### Current State

**Hook Location**: `.husky/_/pre-commit`
```bash
#!/usr/bin/env sh
. "$(dirname "$0")/h"
```

**Issue**: The hook references a script `pre-commit` in the repo root, but **this file doesn't exist**.

### Expected Setup

The pre-commit hook should run `npm run style:check` before allowing commits. Currently:

```bash
# This file is MISSING - should be created at repo root as "pre-commit"
#!/usr/bin/env sh
npm run style:check
```

**Impact**: Commits are NOT being validated for style/lint issues.

---

## 4. Testing Status

### Unit Tests (Vitest) - ✅ PASSING

**Config**: [vitest.config.mts](vitest.config.mts)
- Environment: jsdom
- Plugin: @vitejs/plugin-react
- Excludes: node_modules, e2e

**Results**:
```
✓ tests/unit/Home.test.tsx (1 test)
Test Files: 1 passed (1)
Tests: 1 passed (1)
Duration: 4.33s
```

**Coverage**: Minimal - only testing home page title.

### E2E Tests (Playwright) - ❌ FAILING (CI Only)

**Config**: [playwright.config.ts](playwright.config.ts)
- Browsers: Chromium, Firefox, WebKit
- Reporter: HTML
- WebServer: `npm run dev` on port 3000

**Test File**: [tests/e2e/Home.test.ts](tests/e2e/Home.test.ts)
- Tests page title
- Tests heading visibility

**CI Failure Reason**: Missing `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` environment variables.

**Local Status**: Should work if you have env vars set locally.

---

## 5. Environment Variables - ⚠️ INCOMPLETE

### Current `.env.example`

```bash
DATABASE_URL="postgres://root:postgres_5432@localhost:5432/local"
```

**Missing Variables** (required for CI):
```bash
NEXT_PUBLIC_SUPABASE_URL="your-supabase-url"
NEXT_PUBLIC_SUPABASE_ANON_KEY="your-supabase-anon-key"
```

---

## 6. GitHub Actions - ❌ BLOCKED

**Workflow**: [.github/workflows/tests.yml](.github/workflows/tests.yml)

```yaml
on:
  pull_request:
    branches:
      - main
      - developer
```

**Jobs**: `unit` and `e2e`

**Blockers**:
1. ESLint errors cause `npm run style` to fail
2. E2E tests fail because Supabase env vars not set in CI
3. No explicit secrets setup documented

**Missing**: No environment variables, no lint/style check job, no secrets configuration.

---

## 7. Console.log Statements (Debug Code)

Found **13 console.log statements** that should be removed:

| File | Lines |
|------|-------|
| [src/components/features/students/sheet/sheet-header.tsx](src/components/features/students/sheet/sheet-header.tsx#L24) | 24 |
| [src/components/features/students/student-dialog.tsx](src/components/features/students/student-dialog.tsx) | Multiple |
| [src/components/features/students/sheet/tab-payments.tsx](src/components/features/students/sheet/tab-payments.tsx#L186) | 186 |

---

## Action Items Before Merge

### 🔴 Critical (Must Fix - CI Blocking)

1. **Fix ESLint Errors** - These block CI/CD
   ```typescript
   // Replace `any` with proper types in:
   - scripts/create-super-admin.ts:60
   - src/app/api/auth/login/route.ts:68
   - src/app/api/auth/logout/route.ts:26
   - src/app/dashboard/attendance/scan/page.tsx:43
   ```

2. **Fix Variable Declaration Order** in [attendance/scan/page.tsx](src/app/dashboard/attendance/scan/page.tsx)
   - Move `loadAttendanceCount` before line 121
   - Move `handleMarkAttendanceInternal` before line 213
   - Or use `useCallback` to declare them first

3. **Fix Environment Variables for CI**
   - Update `.env.example` with Supabase variables
   - Add GitHub Actions secrets for `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - OR: Mock Supabase in E2E tests (better approach)

4. **Create Pre-commit Script**
   ```bash
   # Create file at repo root named "pre-commit":
   #!/usr/bin/env sh
   npm run style:check
   ```

### 🟡 High Priority

5. **Remove Unused Variables** (30+ warnings)
6. **Fix React Hooks Dependencies** (3 useEffect warnings)
7. **Remove Console.log Statements** (13 total)

### 🟢 Medium Priority

8. **Add Lint Job to CI** - Explicitly run `npm run style:check` in GitHub Actions
9. **Add More Unit Tests** - Current coverage is minimal
10. **Mock Supabase for E2E** - Avoid needing real credentials in CI

---

## Quick Fix Commands

```bash
# Run lint to see all issues
npm run lint

# Auto-fix what can be fixed
npm run style

# Run tests locally (ensure env vars are set)
npm run test
npm run test:e2e
```

---

## CI/CD Setup Guide

### Option A: Add Real Supabase Credentials to GitHub

1. Go to GitHub repo → Settings → Secrets and variables → Actions
2. Add secrets:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`

### Option B: Mock Supabase for Testing (Recommended)

Update `src/middleware.ts` to handle missing env vars gracefully:

```typescript
export async function middleware(request: NextRequest) {
    // Skip auth check for login page and API routes
    const isLoginPage = request.nextUrl.pathname === '/login';
    const isApiRoute = request.nextUrl.pathname.startsWith('/api');

    if (isLoginPage || isApiRoute) {
        return NextResponse.next();
    }

    // Allow tests to run without Supabase
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
        return NextResponse.next();
    }

    // ... rest of middleware
}
```

### Option C: Skip Middleware in E2E Tests

Add to `playwright.config.ts`:

```typescript
export default defineConfig({
    // ...
    env: {
        SKIP_AUTH: 'true'
    }
});
```

And update middleware to check `process.env.SKIP_AUTH`.

---

## Recommendation

**DO NOT MERGE** until ESLint errors are fixed AND CI is configured. The `any` types and variable declaration issues are blocking CI/CD and represent potential runtime bugs. The E2E tests will continue failing until Supabase credentials or a mocking strategy is added.

**Minimum viable fix:**
1. Fix the 6 ESLint errors (~15 minutes)
2. Create the pre-commit script (~2 minutes)
3. Add GitHub secrets OR mock Supabase for CI (~10 minutes)
4. Verify CI passes (~5 minutes)

**Total time: ~30-45 minutes** to make merge-ready.
