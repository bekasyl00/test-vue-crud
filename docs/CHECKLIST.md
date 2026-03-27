# CHECKLIST — Quality Gate

## Build & Run
- [ ] `npm install` проходит
- [ ] `npm run server` запускает json-server на :3001
- [ ] `npm run dev` запускает UI
- [ ] CRUD сценарии работают end-to-end

## Architecture
- [ ] Нет axios в components/pages (только api layer)
- [ ] Store — единый источник состояния пользователей
- [ ] Типы вынесены в `src/types/*`
- [ ] Ошибки нормализуются (единый формат)

## UX States
- [ ] Loading (list)
- [ ] Error + Retry
- [ ] Empty + CTA
- [ ] Disable buttons during submit/delete
- [ ] Confirm delete

## Forms
- [ ] required поля
- [ ] email validation
- [ ] min length name
- [ ] ошибки отображаются рядом с полями

## TypeScript
- [ ] Нет `any` в доменной логике
- [ ] DTO отделены от сущности
- [ ] Везде строгие типы пропсов/эмитов

## Code Quality
- [ ] ESLint включен
- [ ] Prettier включен
- [ ] нет неиспользуемых переменных/импо��тов

## Tests (минимум 3)
- [ ] Unit: validation
- [ ] Unit: store (mock api)
- [ ] Component: UserForm behavior

## README
- [ ] Как запустить
- [ ] Какие фичи
- [ ] Endpoints
- [ ] Что улучшить