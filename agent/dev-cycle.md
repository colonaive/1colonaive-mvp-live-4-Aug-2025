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


FINALIZATION AND ARCHIVAL

After completing a development cycle, agents must perform the following steps:

1. Generate Window Closure Record

Create a WCR summarizing:

• tasks performed
• files modified
• commands executed
• deployment verification
• recommended next actions

Save to:

project-memory/WCR-{timestamp}.md


2. Create Repository Snapshot

Generate a repository archive so the project state can be shared with external AI contexts.

Procedure:

zip -r COLONAiVE-REPO-{timestamp}.zip .

Place the archive in the project root folder.

Purpose:

• share repository with Master Chat context
• maintain historical checkpoints
• support AI knowledge synchronization


3. Confirm snapshot creation

Verify the ZIP archive exists and report the filename in the closure report.
