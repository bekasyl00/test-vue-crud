# Users CRUD App (Vue 3 + TS)

Production-like SPA for user management with REST backend:
- List, create, edit, delete users
- Search by text and filter by role
- UX states: loading, error, empty, success
- Form validation and typed error handling

## Stack

- Vite
- Vue 3 (Composition API)
- TypeScript (strict)
- Pinia
- Vue Router
- Axios
- json-server
- Vitest + @vue/test-utils
- ESLint/Prettier are planned as a next iteration

## Requirements

- Node.js 20+
- npm 10+

## Setup and Run

Install dependencies:

```bash
npm ci
```

Run backend mock API (json-server):

```bash
npm run server
```

Runs on:

```text
http://localhost:3001
```

Run frontend:

```bash
npm run dev
```

Runs on:

```text
http://localhost:5173
```

Build:

```bash
npm run build
```

Run tests:

```bash
npm run test
```

## Endpoints

Base URL: `http://localhost:3001`

- `GET /users`
- `POST /users`
- `PATCH /users/:id`
- `DELETE /users/:id`
- Search: `GET /users?q=foo`
- Filter: `GET /users?role=admin`

## Project Structure

```text
src/
	api/
		http.ts
		users.api.ts
	components/
		ui/
			BaseAlert.vue
			BaseButton.vue
			BaseInput.vue
			BaseModal.vue
			BaseSelect.vue
		users/
			UserFilters.vue
			UserForm.vue
			UserList.vue
	pages/
		UsersPage.vue
	stores/
		users.store.ts
	types/
		api.ts
		user.ts
	utils/
		debounce.ts
		error.ts
		validation.ts
```

## Architecture Notes

- `api/`: only Axios and REST methods.
- `stores/`: all business logic and state transitions.
- `components/`: presentational and form/UI behavior via props/emits.
- `types/`: shared domain and API types.
- `utils/error.ts`: unified `normalizeApiError` for store/UI contract.

## Trade-offs

- `json-server` is simple and fast for local CRUD, but not feature-complete backend.
- Filters are server-driven (`q`, `role`) for realistic API behavior.
- Form validation is custom utility (lightweight), not schema-library based.
- `window.confirm` is used for delete confirmation to keep UX simple.

## Next Improvements

- Add ESLint + Prettier configuration and CI lint step.
- Add integration tests for full CRUD user flows.
- Add optimistic updates and request cancellation.
- Add pagination for large user lists.
