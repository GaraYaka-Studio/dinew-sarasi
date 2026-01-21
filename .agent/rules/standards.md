---
trigger: always_on
---

Functional Only: No Class Components. Use Hooks.

Server Actions: All DB writes/reads happen in src/actions. UI components only call these actions.

Strict Types: Always import types from database.types.ts. Never use any.

Custom Hooks: Extract complex logic (>10 lines) into src/hooks. Keep UI clean.

Declarative Code: Use .map, .filter, .reduce. Avoid for loops.

Naming:

Booleans: isLoading, hasPaid

Handlers: handleSubmit, handleScan

Actions: getStudents, createPayment

Shadcn/Tailwind: Do not write custom CSS. Use the design system.


Clean Conditionals: Use Ternaries (cond ? <A/> : <B/>) over if-else blocks in JSX.
