# Praktika 7 — Products API with Redis Caching

**Name:** Zovialov Oleh  
**Group:** [Your Group]

## Tech Stack

- **Runtime:** Node.js + TypeScript
- **Framework:** NestJS 10
- **ORM:** TypeORM + PostgreSQL
- **Cache:** Redis via cache-manager
- **Validation:** class-validator + class-transformer
- **Docs:** Swagger (OpenAPI)

---

## Запуск проєкту

```bash
# 1. Запустити PostgreSQL та Redis
docker compose up -d db redis

# 2. Встановити залежності
npm install

# 3. Запустити seed (створити категорії та продукти)
npm run seed  # Створює 3 категорії та 30 продуктів

# 4. Запустити сервер
npm run start:dev
```

Або все разом через Docker Compose:

```bash
docker compose up --build
```

Swagger UI: http://localhost:3000/api/docs

---

## Приклади запитів

### Отримати всі продукти (з пагінацією)
```bash
curl "http://localhost:3000/api/products?page=1&pageSize=10"
```

### Пагінація — сторінка 2 по 5 елементів
```bash
curl "http://localhost:3000/api/products?page=2&pageSize=5"
```

### Фільтрація за категорією
```bash
curl "http://localhost:3000/api/products?categoryId=2"
```

### Фільтрація за ціною
```bash
curl "http://localhost:3000/api/products?minPrice=50&maxPrice=500"
```

### Пошук за назвою
```bash
curl "http://localhost:3000/api/products?search=mac"
```

### Сортування
```bash
curl "http://localhost:3000/api/products?sort=price&order=ASC"
```

### Комбінований запит
```bash
curl "http://localhost:3000/api/products?categoryId=1&minPrice=300&sort=price&order=DESC&page=1&pageSize=5"
```

---

## Перевірка кешування Redis

```bash
# Подивитись ключі кешу
docker compose exec redis redis-cli KEYS "products:*"

# Подивитись TTL конкретного ключа
docker compose exec redis redis-cli TTL "products:<key>"

# Після POST /api/products кеш має очиститись
curl -X POST "http://localhost:3000/api/products" \
  -H "Content-Type: application/json" \
  -d '{"name":"Test Product","price":99,"categoryId":1}'
```

---

## API Endpoints

| Method | Path              | Description                        |
|--------|-------------------|------------------------------------|
| GET    | /api/products     | List products (paginated, filtered)|
| GET    | /api/products/:id | Get product by ID                  |
| POST   | /api/products     | Create a product                   |
| PATCH  | /api/products/:id | Update a product                   |
| DELETE | /api/products/:id | Delete a product                   |

---

## Query Parameters for GET /api/products

| Parameter    | Type   | Default     | Description                    |
|-------------|--------|-------------|--------------------------------|
| page        | number | 1           | Page number (min 1)            |
| pageSize    | number | 10          | Items per page (max 100)       |
| sort        | string | createdAt   | Sort field (name, price, createdAt) |
| order       | string | DESC        | Sort order (ASC, DESC)         |
| categoryId  | number | —           | Filter by category             |
| minPrice    | number | —           | Minimum price                  |
| maxPrice    | number | —           | Maximum price                  |
| search      | string | —           | Search by name (ILIKE)         |
