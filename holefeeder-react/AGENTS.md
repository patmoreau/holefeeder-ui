# Holefeeder React — Agent Guide

## Tech Stack

React Native (Expo SDK 55) · expo-router (file-based routing) · PowerSync + op-sqlite (offline-first sync) · Auth0 (
react-native-auth0) · i18next · pnpm · TypeScript strict

## Key Commands

```bash
pnpm start                  # dev server (APP_ENV=development)
pnpm ios                    # run on iOS simulator
pnpm android                # run on Android emulator
pnpm test                   # Jest (jest-expo preset)
pnpm test -- --coverage     # with 70% threshold enforcement
pnpm lint                   # expo lint
pnpm prebuild:dev           # iOS prebuild (development)
pnpm ios:deploy             # production build to physical device
```

E2E tests use Maestro: `pnpm test:e2e:ios` runs `.maestro/` suite tagged `regression`.

## Architecture: Clean Architecture Layers

```
src/domain/core/          ← Entities, value objects, repository interfaces, use cases
src/domain/persistence/   ← PowerSync implementations of repository interfaces
src/contexts/             ← React providers (AppContext, PowerSyncAuthProvider, RepositoryContext)
src/features/             ← Feature UI + feature-specific form hooks
src/presentation/         ← Shared presentation hooks (wire use cases to React state)
src/shared/               ← Cross-cutting hooks (auth, theme) and API service
src/app/                  ← expo-router route files only
src/config/config.ts      ← All env-var config (never read process.env directly elsewhere)
src/i18n/                 ← i18next, en-CA and fr-CA locales
src/types/icons.ts        ← AppIcons (SF Symbols) + AppIconsMapping (→ Material Icons)
```

## Branded Value Objects

Domain primitives use nominal typing via brand: `Money`, `Variation`, `Id`, `DateOnly`.

- **`create(value)`** — validates and returns `Result<T>` (use when input is untrusted)
- **`valid(value)`** — bypasses validation (use only for already-trusted DB rows)
- Monetary values are stored as **integer cents** in PowerSync; convert with `Variation.fromCents()` /
  `Money.fromCents()`

## Result / AsyncResult Pattern

All domain operations return `Result<T>` (`Success<T> | Failure`) or `AsyncResult<T>` (adds `Loading`).

```typescript
if (result.isSuccess)  result.value   // T
if (result.isFailure)  result.errors  // string[]
if (result.isLoading)  /* show spinner */

Result.combine({ a: resultA, b: resultB })  // merges multiple results
Result.combineArray(resultArray)
```

## Repository + Use-Case Pattern

1. **Interface** in `src/domain/core/<entity>/<entity>-repository.ts`
2. **Implementation** in `src/domain/persistence/<entity>/<entity>-repository-in-powersync.ts` — uses PowerSync
   `.query().watch()` listener pattern
3. **Use case** in `src/domain/core/<entity>/<action>/` — either `Command` (`.execute()`) or `Query` (`.query(onChange)`
   returns unsubscribe fn)
4. **Presentation hook** in `src/presentation/hooks/<entity>/` — calls `useRepositories()`, manages
   `useState<AsyncResult<T>>` + `useEffect` cleanup

Example flow: `useAccounts` → `WatchAccountsUseCase` → `AccountsRepository` → `AccountsRepositoryInPowersync`

## Reactive Query Hook Pattern

```typescript
const useAccounts = (): AsyncResult<Account[]> => {
  const { accountRepository } = useRepositories();
  const [accounts, setAccounts] = useState<AsyncResult<Account[]>>(Result.loading());
  const useCase = useMemo(() => WatchAccountsUseCase(accountRepository), [accountRepository]);
  useEffect(() => {
    const unsubscribe = useCase.query(setAccounts);
    return () => unsubscribe();
  }, [useCase]);
  return accounts;
};
```

For multiple concurrent watches, use `useMultipleWatches` from `src/presentation/hooks/use-multiple-watches.ts`.

## Form Pattern

Use `createFormDataContext<FormData, ErrorEnum>(displayName, saveFn)` from
`src/features/shared/core/use-form-context.tsx` to get a typed context factory with built-in: dirty tracking,
field-level + general errors, validation, save, and an `ErrorSheet` component.

## Provider Nesting (root `_layout.tsx`)

`Auth0Provider` → `AppProvider` → `PowerSyncAuthProvider` → `RepositoryProvider`  
Route protection uses `<Stack.Protected guard={!!user}>` — no manual redirects.

## Config / Environments

- `APP_ENV=development|production` selects `.env.development` / `.env.production`
- All config read through `src/config/config.ts`; never access `process.env` directly in components
- Local services: `powersync.localtest.me` and `holefeeder.localtest.me` via Traefik + mkcert TLS  
  (iOS Simulator requires `/etc/hosts` override and `xcrun simctl keychain <UDID> add-root-cert`)

## Path Aliases

`@/` → `src/` (primary alias for all app code)  
`@tests/` → `tests/` (test utilities only)

## Icons

Always use `AppIcons.<key>` (SF Symbol name) rather than raw strings. Add new icons to both `AppIcons` and
`AppIconsMapping` in `src/types/icons.ts`.

## i18n

All user-facing strings must use `useTranslation()` from react-i18next. Add keys to both
`src/i18n/locales/en-CA/translations.ts` and `src/i18n/locales/fr-CA/translations.ts`.

## Testing Notes

- Test files: `*.spec.ts(x)` or `*.test.ts(x)` (files inside `__tests__/` dirs are excluded from test runs but counted
  for coverage)
- Mock modules live in `__mocks__/` at root; mock context helpers in `tests/setup/`
- Coverage threshold: 70% on branches, functions, lines, statements

