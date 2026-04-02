# GreenMarket 🌿
**GreenMarket** is a backend API for smart inventory management designed for local producers and small businesses. It allows business owners to register their products, track stock levels, and receive automatic alerts when stock is running low — all secured with JWT authentication and role-based access control.

---

## Team
- Diego Alberto Pérez Navarro
- Jorge Alejandro Álvarez Gómez
- Christopher De Luna Alcalá

---

## Technologies Used
- Node.js
- Express.js
- MongoDB Atlas
- Mongoose
- JSON Web Token (JWT)
- bcryptjs
- Swagger (swagger-jsdoc + swagger-ui-express)
- dotenv

---

## Installation Guide

### 1. Clone the repository
```bash
git clone <your-repo-url>
```

### 2. Enter the project folder
```bash
cd GreenMarket
```

### 3. Install dependencies
```bash
npm install
```
This command installs all required libraries defined in **package.json**.

---

## Environment Variables
Create a `.env` file in the root of the project with the following variables:

```env
PORT=4000
MONGO_URI=your_mongodb_atlas_connection_string
JWT_TOKEN_SECRET=your_secret_key
```

> ⚠️ The real `.env` file should **NOT be uploaded to GitHub**. It is listed in `.gitignore`.

---

## Running the Project

```bash
node index.js
```

The API will run on:
```
http://localhost:4000
```

Swagger documentation available at:
```
http://localhost:4000/api-docs
```

---

## Project Structure

GreenMarket uses a **layered architecture (N-Layer)** to keep the code clean and organized.

```
src/
├── config/         # Database and Swagger configuration
├── controllers/    # Business logic and request handling
├── middlewares/    # JWT authentication and role verification
├── models/         # MongoDB schemas (Producto, Usuario)
└── routes/         # API route definitions with Swagger docs
```

---

## Main API Endpoints

### 🔐 Authentication

#### Register user
```
POST /api/auth/register
```
Request body:
```json
{
  "email": "usuario@example.com",
  "password": "secreto123",
  "rol": "admin"
}
```
Expected response `(201 Created)`:
```json
{
  "_id": "user_id",
  "email": "usuario@example.com",
  "rol": "admin"
}
```
Error responses:
- `401` — User already exists

---

#### Login user
```
POST /api/auth/login
```
Request body:
```json
{
  "email": "usuario@example.com",
  "password": "secreto123"
}
```
Expected response `(200 OK)`:
```json
{
  "token": "JWT_TOKEN_HERE"
}
```
Error responses:
- `400` — Invalid credentials

---

#### Get profile
```
GET /api/auth/perfil
```
> 🔒 Requires JWT token

Expected response `(200 OK)`:
```json
{
  "_id": "user_id",
  "email": "usuario@example.com",
  "rol": "admin",
  "nombreNegocio": "Verduras El Campo",
  "umbralStockBajo": 10,
  "umbralStockMedio": 50
}
```

---

#### Update profile
```
PUT /api/auth/perfil
```
> 🔒 Requires JWT token

Request body (all fields optional):
```json
{
  "nombreNegocio": "Verduras El Campo",
  "descripcion": "Tienda de productos orgánicos",
  "umbralStockBajo": 10,
  "umbralStockMedio": 50
}
```

---

### 📦 Products

> 🔒 All product endpoints require the JWT token in the Authorization header:
> ```
> Authorization: Bearer JWT_TOKEN
> ```

#### Get all products
```
GET /api/productos
```
Expected response `(200 OK)`:
```json
[
  {
    "_id": "product_id",
    "nombreProducto": "Manzana orgánica",
    "precio": 25.5,
    "stock": 100,
    "nivelStock": "alto",
    "estado": "disponible",
    "alerta": ""
  }
]
```

---

#### Get low stock products
```
GET /api/productos/bajo-stock
```
Returns only products with `nivelStock: "bajo"` belonging to the authenticated business.

---

#### Create product *(admin only)*
```
POST /api/productos
```
Request body:
```json
{
  "nombreProducto": "Manzana orgánica",
  "descripcion": "Manzana roja cultivada sin pesticidas",
  "precio": 25.5,
  "stock": 100,
  "categoria": "frutas",
  "productor": "Rancho El Verde",
  "ubicacion": "Bodega A, estante 3"
}
```
Expected response `(200 OK)` — the system automatically calculates `nivelStock`, `alerta`, and `estado`:
```json
{
  "_id": "product_id",
  "nombreProducto": "Manzana orgánica",
  "stock": 100,
  "nivelStock": "alto",
  "estado": "disponible",
  "alerta": ""
}
```
Error responses:
- `403` — Insufficient role (admin required)

---

#### Update product *(admin only)*
```
PUT /api/productos/:id
```
Request body:
```json
{
  "stock": 5,
  "precio": 30
}
```
The system recalculates `nivelStock` and `alerta` automatically based on the new stock value.

---

#### Delete product *(admin only)*
```
DELETE /api/productos/:id
```
Expected response `(200 OK)`:
```json
{
  "message": "Producto eliminado correctamente"
}
```

---

## Smart Stock Logic 🧠

One of GreenMarket's core features is its **intelligent stock level calculation**. Instead of fixed thresholds, each business defines its own limits in their profile:

| Field | Default | Description |
|-------|---------|-------------|
| `umbralStockBajo` | 10 | Units below this = low stock alert |
| `umbralStockMedio` | 50 | Units below this = medium stock warning |

Every time a product is created or updated, the system automatically assigns:

| Condition | nivelStock | estado | alerta |
|-----------|------------|--------|--------|
| stock = 0 | bajo | agotado | "Producto agotado" |
| stock < umbralStockBajo | bajo | disponible | "Stock bajo, considera reabastecer pronto." |
| stock < umbralStockMedio | medio | disponible | "Stock medio, Se recomienda realizar un pedido pronto..." |
| stock >= umbralStockMedio | alto | disponible | "" |

---

## Security

GreenMarket uses **JSON Web Tokens (JWT)** for authentication and **role-based access control** to protect critical routes.

Authentication flow:
1. The user registers or logs in.
2. The server generates a JWT token (expires in 1 hour).
3. The client stores the token and sends it in subsequent requests.
4. The `auth` middleware verifies the token before allowing access.
5. The `checkRole` middleware additionally verifies the user's role for admin-only routes.

Example request header:
```
Authorization: Bearer TOKEN
```

Role permissions:
- `user` — Can view products and check stock
- `admin` — Can create, update, and delete products
