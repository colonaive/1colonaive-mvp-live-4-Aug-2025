Refer to CLAUDE.md for detailed project architecture and development commands.

PROJECT CONTEXT

This workspace develops the ColonAiVE platform and related AI tools.

PROJECT KNOWLEDGE BASE

Agents must load all files from the agent/knowledge folder before planning or executing tasks.

Agents must consult the marketing knowledge base when generating promotional materials.

This knowledge base contains:

• ColonAiQ scientific background
• clinical workflow
• market strategy
• technical architecture
• project objectives

Use this knowledge to guide decisions in architecture, messaging, and implementation.

Primary objectives:

• build healthcare AI applications
• automate development workflows
• maintain production reliability
• deploy continuously with verification


TECH STACK

Vite
React 18
Typescript
Tailwind
Netlify
Supabase
Node.js

Execution policy:

Claude → architecture
Codex → code implementation
Browser agent → deployment verification
Gemini → research tasks


EXECUTION AUTHORITY

Agents are allowed to:

• create files
• modify code
• install packages
• run builds
• commit code
• push to main branch
• verify deployment using browser agent


STANDARD WORKFLOW

1 analyze request
2 implement code
3 run build
4 fix errors
5 commit
6 git push main
7 wait for Netlify deployment
8 browser verification
9 closure report


CODE QUALITY

Maintain:

• modular architecture
• readable code
• minimal dependencies
• production stability


REPORTING

Closure reports must include:

• files modified
• commands executed
• deployment verification
• recommended next actions

GLOBAL CODE QUALITY POLICY

All agents must perform code validation before committing changes.

Required checks (in order):

1. npm run build — must exit 0, no errors
2. npm run lint — must exit 0, no errors
3. npx tsc --noEmit — must report zero TypeScript errors

Agents must automatically fix any errors detected before proceeding.

Common auto-fixable issues:

• missing or incorrect imports
• unused variables (remove them)
• type mismatches (correct the type annotation)
• unresolved module paths
• ESLint formatting violations (run eslint --fix)

No deployment should occur if any check still fails after fix attempts.

If an error cannot be auto-resolved, the agent must report it and halt before committing.


SESSION DOCUMENTATION

After every completed development task, generate a Window Closure Record using the window-closure-record skill and save it in the project-memory folder.