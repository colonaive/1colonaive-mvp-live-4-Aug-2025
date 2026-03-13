# Development Cycle Workflow — Pre-Deployment Quality Gate

Every deployment must pass this gate. No exceptions.

---

## Pre-Deployment Checklist

Run these commands **in order** before every commit:

### 1. Auto-fix lint issues

```bash
npx eslint --fix src/
```

### 2. Run lint check

```bash
npm run lint
```

- Must exit 0 with no errors
- Warnings are acceptable

### 3. Run TypeScript type check

```bash
npx tsc --noEmit
```

- Must report zero errors
- Fix type mismatches, missing imports, unused variables automatically

### 4. Run production build

```bash
npm run build
```

- Must exit 0 with no errors
- Chunk size warnings are acceptable

### 5. Review changes

```bash
git diff --stat
```

- Verify only intended files are modified
- Ensure no secrets (.env, credentials) are staged

---

## If Any Check Fails

1. Identify root cause from error output
2. Fix the error in the relevant source file
3. Re-run the failing check
4. Repeat until all checks pass

### Common Auto-Fixable Issues

- Missing imports → add the import
- Unused variables → remove them
- Type mismatches → correct the type annotation
- Unresolved module paths → verify path alias (@/) or relative path
- JSX return type errors → ensure proper React.FC typing

---

## Deployment Steps

After quality gate passes:

```bash
git add <specific-files>
git commit -m "descriptive message"
git push origin main
npx netlify deploy --prod
```

---

## Post-Deployment Verification

1. Confirm Netlify deploy succeeds (check deploy URL)
2. Verify key pages load on production
3. Test any new/modified API endpoints
4. Generate Window Closure Record if session-ending work
