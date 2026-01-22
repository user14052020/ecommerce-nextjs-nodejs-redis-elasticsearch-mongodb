# NextJS eCommerce
<img width="1903" height="925" alt="Screenshot 2026-01-22 at 11 50 27" src="https://github.com/user-attachments/assets/7a5e864e-7a90-4220-939c-27ece170560f" />

Интернет-магазин на Node.js/Express/MongoDB с двумя интерфейсами: публичный сайт (Next.js) и админ‑панель (Next.js). Проект использует сервисную архитектуру, Elasticsearch для поиска и Redis для кэша. Сайт мультиязычный.

## Стек
- Backend: Node.js, Express, Mongoose, TypeScript
- Frontend: Next.js (website), Next.js (admin), Ant Design, Tailwind CSS
- DB: MongoDB
- Search: Elasticsearch (товары, категории, бренды)
- Cache: Redis

## Архитектура
- `routes` только валидируют вход и вызывают сервисы
- `services` содержат бизнес‑логику
- `repositories` инкапсулируют работу с MongoDB
- `Unit of Work` для транзакций записи
- `exceptionHandlers` и `errors` для единообразной обработки ошибок
- `/api/v1` для версионирования API, `/health` для healthcheck
- Автоматическое первичное заполнение БД при первом запуске

## Мультиязычность
Интерфейсы website и admin используют `react-intl` + локали Ant Design. Текущая локаль хранится в Redux (`settings.locale`) и передается в `LocaleProvider`, который оборачивает приложение в `IntlProvider` и `ConfigProvider`.

Где лежат переводы:
- website: `website/providerLang/entries/*` + JSON‑файлы в `website/providerLang/locales/`
- admin: `admin/app/core/providerLang/entries/*` + JSON‑файлы в `admin/app/core/providerLang/locales/`

Список доступных языков и язык по умолчанию задаются в `config.js` (`languageData`, `defaultLanguage`). В админке переключение языка доступно в верхнем хедере; переключатель диспатчит `switchLanguage` и обновляет `settings.locale`.

## Алиасы импортов
- `@app/*` — корень текущего приложения (backend/admin/website)
- `@root/*` — корень репозитория

## Поиск (Elasticsearch)
Индексация происходит по товарам, категориям и брендам. Поиск товаров использует Elastic и возвращает данные из MongoDB в порядке релевантности.

Доступные endpoints:
- `POST /productspublic` — поиск товаров
- `GET /categoriespublic/search?q=...` — поиск категорий
- `GET /brandspublic/search?q=...` — поиск брендов

## Кэш (Redis)
Кэшируются публичные витринные данные (`settings`, `topmenu`, `categories`, `brands`, `homeslider`, `cargoes`, `paymentmethods`) и поисковые результаты товаров.

## Запуск локально
Требования: Node.js 18+, MongoDB, Redis, Elasticsearch.

### 1) Настройка переменных окружения
Создайте `backend/.env`:

```env
ATLAS_URI=mongodb://localhost:27017/nextjs
PASPORTJS_KEY=nextjskey
REDIS_URL=redis://localhost:6379
REDIS_TTL_SECONDS=60
ELASTICSEARCH_URL=http://localhost:9200
ELASTICSEARCH_PREFIX=nextjs
ELASTICSEARCH_REINDEX_ON_START=true
CORS_ORIGINS=http://localhost:3000,http://localhost:8000
```

### 2) Установка зависимостей
```bash
npm run allnpmi
```

### 3) Запуск
```bash
npm run allnpmdev
```

Сервисы:
- backend: `http://localhost:5001`
- website: `http://localhost:3000`
- admin: `http://localhost:8000`

### Автосид (наполнение БД)
Первичное заполнение выполняется автоматически при первом запуске backend.
Ручной запуск также доступен: `GET /installdb`.

## Запуск в Docker
Требования: Docker и docker-compose.

### 1) Сборка и запуск
```bash
docker-compose up -d --build
```

### 2) Доступ к сервисам
- backend: `http://localhost:5001`
- website: `http://localhost:3000`
- admin: `http://localhost:8000`
- elasticsearch: `http://localhost:9200`
- redis: `http://localhost:6379`
- mongodb: `mongodb://localhost:27017/nextjs`

### Автосид
Наполнение БД выполняется автоматически при первом старте backend.

## Примечания
- `config.js` поддерживает переопределение через переменные окружения `API_URL`, `WEBSITE_URL`, `IMG_URL`.
- Чтобы отключить автоматическую переиндексацию Elastic при старте, установите `ELASTICSEARCH_REINDEX_ON_START=false`.
