# Contributing to Doxify

Thanks for taking the time to contribute!

## Getting started

- Install dependencies at the repo root: `npm install`
- Run services in dev:
  - Gateway: `npm -w @doxify/api-gateway run dev`
  - Services: `npm -w <service> run dev`
  - Frontend: `npm -w @doxify/web run dev`

## Branching and commits

- Use feature branches: `feat/<scope>-<short-desc>`
- Commit messages: conventional style is appreciated (e.g., `feat(auth): add refresh token endpoint`).

## Code style

- TypeScript strictness where possible
- Run Prettier and ESLint before pushing

## Pull requests

- Include a clear description, screenshots for UI changes
- Add or update documentation when behavior changes
- Keep PRs focused and small when possible

## Security

- Do not include secrets in code or commits
- Report vulnerabilities privately (see SECURITY.md)
