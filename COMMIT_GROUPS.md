# Commit Groups

## Commit 1: Create Firestore service layer
```bash
git add apps/web/src/services/firestore/
git add apps/web/src/data/exercises.ts
```
**Message:** Add Firestore services for direct database access

Replace REST endpoints with client-side services. Move data fetching logic from server to browser using Firestore SDK.

## Commit 2: Migrate components to use Firestore services
```bash
git add apps/web/src/pages/
git add apps/web/src/components/
```
**Message:** Switch components to use Firestore services

Update all pages and components to call Firestore services directly instead of REST endpoints. Remove httpClient dependency.

## Commit 3: Remove server infrastructure
```bash
git add apps/web/server.ts
git add apps/web/src/api/
git add apps/web/src/utils/httpClient.ts
git add apps/web/src/utils/authMiddleware.ts
git rm apps/web/server.ts 2>/dev/null || true
git rm -rf apps/web/src/api/handlers/ 2>/dev/null || true
git rm apps/web/src/api/context.ts 2>/dev/null || true
git rm -rf apps/web/src/api/routers/ 2>/dev/null || true
git rm apps/web/src/utils/httpClient.ts 2>/dev/null || true
git rm apps/web/src/utils/authMiddleware.ts 2>/dev/null || true
```
**Message:** Remove server and REST API infrastructure

Delete Express server, API handlers, and related utilities. The app now runs purely client-side with direct Firestore access.

## Commit 4: Add Firestore security rules
```bash
git add firestore.rules
```
**Message:** Add Firestore security rules for user data protection

Restrict data access to authenticated users with scoped permissions.

## Commit 5: Update build configuration for client-side only
```bash
git add apps/web/package.json
```
**Message:** Remove server dependencies from build config

Update package.json to remove server startup scripts and unnecessary dependencies.

## Commit 6: Remove migration docs
```bash
git rm MIGRATION_GUIDE.md NEXT_STEPS.md MIGRATION_STATUS.md API_ENDPOINTS_MAP.json MIGRATION_COMPLETE.md FINAL_MIGRATION_STATUS.md MIGRATION_PROGRESS.md FIX_SUMMARY.md COMMIT_GROUPS.md 2>/dev/null || true
```
**Message:** Clean up migration documentation

Remove temporary files used during the migration process.

