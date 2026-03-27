# AGENT_PLAN — Vue 3 + TS Users CRUD (REST) — Executable Spec

## 0) Goal
Р��ализовать учебный, но “production-like” проект на Vue 3 (Composition API) + TypeScript:
- CRUD пользователей (List/Create/Edit/Delete)
- Работа с REST API (json-server)
- Управление состоянием (Pinia)
- Формы с валидацией
- UX состояния: loading / error / empty / success
- Поиск + фильтр

## 1) Definition of Done (DoD)
Считается готовым, если выполнено всё:
1. `npm ci` (или `npm install`) проходит без ошибок.
2. `npm run server` поднимает json-server на `http://localhost:3001`.
3. `npm run dev` поднимает фронт (Vite) на `http://localhost:5173`.
4. На странице `/users`:
   - отображается список пользователей из API;
   - есть поиск (debounce) и фильтр по role;
   - есть создание пользователя через форму с валидацией;
   - есть редактирование пользователя (предзаполненная форма);
   - есть удаление пользователя с подтверждением.
5. Корректно обработаны состояния:
   - Loading: показывается индикатор/скелетон.
   - Error: показывается ошибка + кнопка Retry.
   - Empty: показывается пустое состояние + CTA “Создать”.
6. TypeScript строгий: нет `any` в бизнес-логике (допускается только в изолированном месте, если необходимо).
7. Минимум 3 теста (Vitest) проходят `npm run test`.
8. README описывает запуск, скрипты, endpoints, структуру, решения и улучшения.

## 2) Tech Stack (фиксируем)
- Vite
- Vue 3 + Composition API
- TypeScript
- Pinia
- Vue Router
- Axios
- json-server
- ESLint + Prettier
- Vitest + @vue/test-utils

## 3) Commands / Scripts (package.json)
Обязательные скрипты:
- `dev`: запуск фронта
- `build`: сборка
- `preview`: превью
- `server`: `json-server --watch db.json --port 3001`
- `test`: vitest
- (опционально) `start`: параллельно `server` + `dev` (через concurrently)

## 4) Data Model (types)
Создать файл `src/types/user.ts`:

- `export type UserRole = 'admin' | 'manager' | 'student'`
- `export interface User { id: number; name: string; email: string; role: UserRole; }`
- `export type CreateUserDto = Omit<User, 'id'>`
- `export type UpdateUserDto = Partial<CreateUserDto>`

Создать файл `src/types/api.ts`:
- `export interface ApiError { message: string; status?: number; details?: unknown }`
- Утилита `normalizeApiError(e: unknown): ApiError` (см. раздел 7)

## 5) API Contract (json-server)
`db.json` должен содержать массив `users` (3–5 элементов).

Base URL: `http://localhost:3001`

Endpoints:
- `GET /users`
- `POST /users` body: CreateUserDto
- `PUT /users/:id` body: CreateUserDto (json-server ожидает полный объект, либо использовать PATCH)
- `PATCH /users/:id` body: UpdateUserDto (предпочтительнее для partial update)
- `DELETE /users/:id`
- Search: `GET /users?q=<text>`
- Filter: `GET /users?role=<role>`
- Combined: `GET /users?q=<text>&role=<role>` (проверить поведение json-server)

Принять решение: использовать `PATCH` для update, чтобы не собирать полный объект.

## 6) Architecture Rules (layering)
Правила:
1. Компоненты UI НЕ делают axios-запросы напрямую.
2. HTTP вызовы только в `src/api/*`.
3. Store (Pinia) — единственный владелец состояния списка пользователей и его статусов.
4. Page-компонент orchestrates: вызывает store actions и передаёт данные вниз.
5. Компоненты форм/списков получают данные/колбэки через props/emits.
6. Валидация формы выполняется в компоненте формы (или в `utils/validation.ts`), но ошибки отображаются в UI.

## 7) Files / Folder Structure (create exactly)
Создать/использовать структуру:

- `src/api/http.ts`
- `src/api/users.api.ts`
- `src/stores/users.store.ts`
- `src/types/user.ts`
- `src/types/api.ts`
- `src/utils/debounce.ts`
- `src/utils/validation.ts`
- `src/utils/error.ts` (normalizeApiError)
- `src/router/index.ts`
- `src/pages/UsersPage.vue`
- `src/components/users/UserFilters.vue`
- `src/components/users/UserList.vue`
- `src/components/users/UserForm.vue`
- `src/components/ui/BaseButton.vue`
- `src/components/ui/BaseInput.vue`
- `src/components/ui/BaseSelect.vue`
- `src/components/ui/BaseModal.vue`
- `src/components/ui/BaseAlert.vue`

## 8) Implementation Milestones (execute in order)

### Milestone A — Bootstrap
1. Инициализировать Vite Vue TS проект.
2. Подключить Pinia и Router в `main.ts`.
3. Создать маршрут `/users` -> `UsersPage.vue`.
4. Добавить `db.json` и скрипт `server`.

Acceptance:
- `/users` открывается (пусть пусто).
- `npm run server` отдаёт `GET /users`.

### Milestone B — HTTP + API layer
1. `src/api/http.ts`: axios instance:
   - baseURL `http://localhost:3001`
   - timeout (например 10s)
2. `src/api/users.api.ts`:
   - `getUsers(params: { q?: string; role?: UserRole | 'all' }): Promise<User[]>`
   - `createUser(dto: CreateUserDto): Promise<User>`
   - `updateUser(id: number, dto: UpdateUserDto): Promise<User>`
   - `deleteUser(id: number): Promise<void>`

Acceptance:
- Любой вызов API доступен из кода (без UI).

### Milestone C — Store (Pinia)
`src/stores/users.store.ts`:
State:
- `items: User[]`
- `isLoading: boolean`
- `isSaving: boolean` (для create/update)
- `isDeletingIds: Set<number>` (или Record<number, boolean>)
- `error: ApiError | null`
- `query: string`
- `role: UserRole | 'all'`

Actions:
- `fetchUsers()`: учитывает `query` + `role` (серверные query params). Должен выставлять `isLoading`, чистить `error`.
- `createUser(dto)`: выставлять `isSaving`, по success либо рефетч, либо push.
- `updateUser(id, dto)`: `isSaving`, обновить элемент в `items`.
- `deleteUser(id)`: пометить `isDeletingIds`, удалить локально (optimistic) и откатить при ошибке либо сделать refetch.

Getters:
- (опционально) `hasFilters`, `isEmpty`.

Acceptance:
- Store изолирует всю логику состояния и ошибок.

### Milestone D — UI: UsersPage (orchestration)
`UsersPage.vue`:
- OnMounted: `store.fetchUsers()`
- Показывать:
  - Loading state
  - Error state + Retry
  - Empty state
  - Основной контент: фильтры + список + кнопка Create

Acceptance:
- Все состояния видны/переключаются.

### Milestone E — Components
1. `UserFilters.vue`
   - props: `query`, `role`, `isLoading`
   - emits: `update:query`, `update:role`, `reset`
   - Debounce для query (использовать `utils/debounce.ts`), либо debounce делать в UsersPage перед вызовом `store.fetchUsers()`.
   - После изменения фильтров триггерить `store.fetchUsers()`.

2. `UserList.vue`
   - props: `users`, `isDeletingIds`
   - emits: `edit(user)`, `delete(userId)`
   - Таблица/список + кнопки Edit/Delete

3. `UserForm.vue`
   - режимы: create/edit (через props `mode` и `initialUser?`)
   - локальный state формы
   - валидация:
     - name required, min 2
     - email required, email format
     - role required
   - emits:
     - `submit(dto)` где dto = CreateUserDto или UpdateUserDto (в зависимости от режима)
     - `cancel`

4. UI base components
   - минимальные, но типобезопасные, с label и error text

Acceptance:
- Create/Edit работают через форму.
- Delete работает через подтверждение.

### Milestone F — Modal & UX details
- `BaseModal.vue`:
  - закрытие по overlay click + ESC
  - focus trap (минимально: фокус на первом поле при открытии; вернуть фокус на кнопку открытия после закрытия)
- Показывать success message (можно простой `BaseAlert` сверху, авто-скрытие по таймеру опционально)

Acceptance:
- UX аккуратный, без “мерцаний”, кнопки дизейблятся при сабмите.

### Milestone G — Tests (minimum 3)
Добавить Vitest tests:
1. `validation` unit: корректный email, required, min length.
2. Store unit: `fetchUsers` выставляет loading/error корректно (API замокать через vi.mock).
3. Component test: `UserForm` не эмитит submit при невалидных данных.

Acceptance:
- `npm run test` зелёный.

### Milestone H — README & polish
README:
- запуск
- endpoints
- структура
- решения (почему Pinia, почему json-server)
- улучшения

Acceptance:
- README понятный, как для ревьюера.

## 9) Error handling standard
Создать `normalizeApiError(e: unknown)`:
- если axios error: взять status + message (из response.data если есть)
- иначе: message = String(e)

Store всегда хранит `ApiError`, UI всегда показывает `error.message`.

## 10) Non-functional Requirements
- Не использовать классовые компоненты.
- Не использовать Options API.
- Стараться не плодить “магические строки”.
- Везде использовать типы из `src/types/*`.