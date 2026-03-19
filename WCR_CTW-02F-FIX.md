# WCR — CTW-COCKPIT-02F-FIX

**Window:** CTW-COCKPIT-02F-FIX — Runtime Error Fix
**Status:** CLOSED
**Date:** 2026-03-20

---

## Root Cause

The `Map` icon component imported from `lucide-react` on line 22 of `CEOCockpit.tsx` **shadowed the global JavaScript `Map` constructor**. Four locations in the file used `new Map()` or `new Map(prev)` for state management (tracked actions). In the production Vite build, `Map` was minified to `xa`, producing the runtime error:

> **xa is not a constructor**

The error only manifested in production builds because Vite's minifier renamed the shadowed import, making the error message opaque.

## Fix Applied

- Renamed the lucide-react import from `Map` to `Map as MapIcon` (line 22).
- Updated the single JSX usage from `<Map size={18} />` to `<MapIcon size={18} />` (line 1063).
- No logic, features, or unrelated code were changed.

## Verification

- `npm run build` passes cleanly (typecheck + Vite production build).
- All `new Map()` calls now correctly reference the global JavaScript constructor.
- Commit: `9d59280` pushed to `main`.

## Files Changed

| File | Change |
|------|--------|
| `src/pages/admin/CEOCockpit.tsx` | Renamed `Map` → `MapIcon` import alias; updated JSX reference |
