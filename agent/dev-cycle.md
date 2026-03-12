STANDARD DEVELOPMENT WORKFLOW

1 understand feature request
2 analyze repository structure
3 create implementation plan
4 implement code changes
5 CODE QUALITY GATE (mandatory before commit)
6 commit code
7 git push main
8 wait for Netlify deployment
9 run browser verification
10 generate closure report
11 generate Window Closure Record


CODE QUALITY GATE — STEP 5

This step is mandatory. No commit may proceed until all checks pass.

Run the following checks in order:

1. npm run build
   — must exit 0 with no errors
   — warnings are acceptable (e.g. chunk size warnings)

2. npm run lint
   — must exit 0 with no errors
   — auto-fix where possible: npx eslint --fix src/

3. TypeScript diagnostics
   — run: npx tsc --noEmit
   — must report zero errors

If any check fails, the agent must:

— identify the root cause
— fix the error in the relevant source file
— re-run the failing check
— repeat until all three checks pass

Common issues to resolve automatically:

• missing imports
• unused variables (remove them)
• type mismatches (correct the type)
• unresolved module paths
• JSX return type errors

Only after all three checks pass may the agent proceed to step 6 (commit).
