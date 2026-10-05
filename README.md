# Store API

A simple product search API built with **Express**, **Mongoose**, and **TypeScript**. Part of the Node / Express course (`04-store-api`).

Provides filtering, sorting, field selection, numeric filters, and pagination over a `products` collection.

## Tech Stack

- Node.js + Express 4
- Mongoose 9 + MongoDB Atlas
- TypeScript + `tsx` for dev
- `express-async-errors`, `dotenv`

## Project Structure

```
src/
  app.ts                      # entry point, DB connect + listen
  controllers/products.ts     # getAllProducts, getAllProductsStatic
  routes/products.ts           # GET / and GET /static
  models/products.ts          # Product mongoose model
  types/product.ts            # Company, ProductFilter types
  database/
    connectDB.ts              # mongoose.connect(connString, { dbName })
    populateProducts.ts       # seed script
    seed.json                 # ~23 sample products
  middleware/
    notFound.ts
    errorHandler.ts
```

## 1. Setting up MongoDB Atlas

1. Create an account at https://cloud.mongodb.com and create a new project.
2. **Build a Cluster**: `Free M0` tier is fine. Pick a nearby region, leave defaults.
3. **Database Access** (left sidebar) → Add Database User:
   - Auth method: Password
   - Username / password — save these, you'll need them for the connection string.
   - Built-in role: `Atlas Admin` (or `Read and write to any database` for this project).
4. **Network Access** → Add IP Address:
   - For development: `Allow Access from Anywhere` (`0.0.0.0/0`).
   - For production: add only your server IP.
5. **Database → Connect → Drivers → Node.js / Mongoose** and copy the connection string. It looks like:
   ```
   mongodb+srv://<username>:<password>@<cluster>.mongodb.net/?appName=Course
   ```
6. Create a `.env` file in this `starter/` directory (see `.env.example` values below). `DB_NAME` and `PRODUCTS_COLLECTION_NAME` create the DB / collection on first write — you don't need to create them manually in Atlas.

```bash
# .env
DB_CONN_STRING="mongodb+srv://<username>:<password>@<cluster>.mongodb.net/?appName=Course"
DB_NAME="StoreDB"
PRODUCTS_COLLECTION_NAME="products"
PORT=5000
```

> `.env` is gitignored (`/.env`). Never commit real credentials.

## 2. Install & Seed the Database

```bash
npm install
```

Seed data lives in `src/database/seed.json` (name, price, company, rating, featured). The seed script (`src/database/populateProducts.ts`) clears the collection and re-inserts it:

```ts
await Product.deleteMany();
await Product.insertMany(jsonProducts);
```

Run it with:

```bash
npx tsx src/database/populateProducts.ts
```

Expected output:

```
MongoDB connected
Success at populating products
```

Verify in Atlas: **Browse Collections** → `StoreDB` → `products` should show the seeded documents.

To re-seed at any time, just re-run the command (it wipes first).

## 3. Run the API

Dev (watch mode):

```bash
npm run dev
```

Production build:

```bash
npm run build
npm start
```

Server listens on `process.env.PORT || 3000`. With the example `.env` above: `http://localhost:5000`.

Health check: `GET /` returns `Store API` HTML with a link to `/api/products`.

## 4. Endpoints

### `GET /api/products/static`

Hardcoded test query — useful to verify DB connection:

- Finds `name` matching `/wooden/i` with `price < 30`
- Sorts by `name -price`, selects `name price`, `limit 3, skip 1`

```bash
curl http://localhost:5000/api/products/static
```

Response:

```json
{
  "status": "success",
  "products": [{ "name": "...", "price": 25 }],
  "nbHits": 1
}
```

### `GET /api/products`

Full query API. All params are optional.

| Param | Example | Description |
|---|---|---|
| `featured` | `?featured=true` | Must be `true` or `false`, else 400 |
| `company` | `?company=ikea` | One of `ikea`, `liddy`, `caressa`, `marcos`, else 400 |
| `name` | `?name=table` | Case-insensitive regex search |
| `sort` | `?sort=price,-rating` | Comma-separated, `-` = desc. Default: `createdAt` |
| `select` | `?select=name,price` | Comma-separated fields to return |
| `numericFilters` | `?numericFilters=price>30,rating>=4` | Only `price` and `rating`; ops `>`, `>=`, `=`, `<`, `<=` |
| `page` / `limit` | `?page=2&limit=5` | Pagination. Defaults: `page=1`, `limit=10` |

Examples:

```bash
# all products (paginated, 10 per page)
curl http://localhost:5000/api/products

# filter + search
curl "http://localhost:5000/api/products?featured=true&company=marcos&name=chair"

# sort + field selection
curl "http://localhost:5000/api/products?sort=-price,name&select=name,price,company"

# numeric filters + pagination
curl "http://localhost:5000/api/products?numericFilters=price>30,rating>=4&page=2&limit=5"
```

Response shape:

```json
{
  "status": "success",
  "products": [
    {
      "_id": "...",
      "name": "accent chair",
      "price": 25,
      "featured": false,
      "rating": 4,
      "company": "marcos",
      "createdAt": "..."
    }
  ],
  "nbHits": 1
}
```

Error responses:

```json
// 400 — bad company
{ "status": "fail", "message": "company must be one of: ikea, liddy, caressa, marcos" }

// 400 — bad featured
{ "status": "fail", "message": "featured must be either true or false" }

// 404 — unknown route (middleware/notFound.ts)
"Route does not exist"
```

## Product Schema

Defined in `src/models/products.ts`:

| Field | Type | Notes |
|---|---|---|
| `name` | String, required | e.g. `"accent chair"` |
| `price` | Number, required | e.g. `25` |
| `featured` | Boolean | default `false` |
| `rating` | Number | default `4.5` |
| `createdAt` | Date | default `Date.now()` |
| `company` | String enum | `ikea \| liddy \| caressa \| marcos` |

Collection name comes from `PRODUCTS_COLLECTION_NAME` (default `"products"`).

## Troubleshooting

- `Error connecting to MongoDB` on start/seed → check `DB_CONN_STRING` credentials and that your IP is allowlisted in Atlas **Network Access**.
- Empty `products: []` → you haven't seeded yet, or `DB_NAME` / `PRODUCTS_COLLECTION_NAME` in `.env` doesn't match where you seeded. Re-run the seed script.
- `PORT` in use → change `PORT` in `.env`.
