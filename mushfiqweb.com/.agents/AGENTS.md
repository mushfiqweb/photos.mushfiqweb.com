# Project Rules

- **Do Not Run Production Builds automatically**: For this project, do not run `pnpm build` to verify changes. Instead, only verify code correctness by checking that it compiles successfully using `pnpm typecheck` or `npx tsc -b`.
- **Use pnpm**: Always use `pnpm` as the package manager and dependency tool (e.g., use `pnpm typecheck` instead of `npm run typecheck`).
