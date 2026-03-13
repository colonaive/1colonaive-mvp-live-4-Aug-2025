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
4. **Chief-of-Staff review before completion** — verify changes are reflected in:
   - Task Engine (`src/chief-of-staff/tasks/taskEngine.ts`) — update task states
   - Operations Engine (`src/chief-of-staff/operations/operationsEngine.ts`) — confirm system health
   - Roadmap Engine (`src/chief-of-staff/roadmap/roadmapEngine.ts`) — update feature status if applicable
5. Generate Window Closure Record if session-ending work

---

## Session Completion Protocol

Every major implementation session MUST end with the following steps:

### 1. Generate a Window Closure Record (WCR)

**File path:**
```
project-memory/WCR-{YYYY-MM-DD}-{topic}.md
```

The WCR must contain:
- Date
- Session topic
- Summary of changes
- Files modified
- Infrastructure updates
- Deployment status
- Next recommended actions

### 2. Create a repository snapshot ZIP

**Command:**
```powershell
$ts = Get-Date -Format "yyyy-MM-dd-HHmm"
git archive --format=zip -o "COLONAiVE-REPO-$ts.zip" HEAD
```

Save ZIP in repo root.

### 3. Commit both the WCR and snapshot

```bash
git add .
git commit -m "Session archive: WCR + repo snapshot"
git push origin main
```

### 4. Verify Netlify auto-deploy triggered

Check Netlify dashboard or CLI to confirm the push triggered a new production deploy.

---

**This rule applies to ALL AGENTS including:**

- Claude CTO
- Codex Engineer
- Gemini Research
- Browser QA
- Chief-of-Staff AI

No session is considered complete until the WCR is written, the snapshot is created, and the commit is pushed.
