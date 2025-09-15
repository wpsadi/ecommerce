# Routes Design Patterns

This document outlines the standard patterns and best practices for implementing routes in our backend architecture.

## Routes Structure

Every routes file should:

1. Be in the `routes/` folder with a name that reflects the resource (`{resource}.routes.ts`)
2. Export a router that contains all endpoints for that resource
3. Import controllers from the appropriate controller folders
4. Apply any necessary middleware (auth, etc.)
5. Define clear, RESTful routes

## Standard Routes Pattern

```typescript
import { Router } from "express";
import { authMiddleware } from "../middlewares/auth.middleware";

// Import controllers for this resource
import { listResources } from "../controllers/resource.controllers/listResources";
import { getResource } from "../controllers/resource.controllers/getResource";
import { createResource } from "../controllers/resource.controllers/createResource";
import { updateResource } from "../controllers/resource.controllers/updateResource";
import { deleteResource } from "../controllers/resource.controllers/deleteResource";

// Create router
const router = Router();

// Define routes
router.get("/", listResources);
router.get("/:id", getResource);
router.post("/", authMiddleware, createResource);
router.put("/:id", authMiddleware, updateResource);
router.delete("/:id", authMiddleware, deleteResource);

// Export router
export const resourceRoutes = router;
```

## RESTful Routes Design

Follow RESTful principles for route design:

| HTTP Method | Path         | Controller        | Purpose                             |
|-------------|--------------|-------------------|-------------------------------------|
| GET         | /resources   | listResources     | List/search resources               |
| GET         | /resources/:id | getResource     | Get a single resource               |
| POST        | /resources   | createResource    | Create a new resource               |
| PUT         | /resources/:id | updateResource  | Update a resource (full replacement)|
| PATCH       | /resources/:id | patchResource   | Update a resource (partial update)  |
| DELETE      | /resources/:id | deleteResource  | Delete a resource                   |

## Nested Resources

For related resources, use nested routes:

```typescript
// routes/products.routes.ts
const router = Router();

// Standard product routes
router.get("/", listProducts);
router.get("/:id", getProduct);

// Nested routes for reviews
router.get("/:productId/reviews", listProductReviews);
router.post("/:productId/reviews", authMiddleware, createProductReview);

export const productRoutes = router;
```

## Route Middleware

Apply middleware at the router level for common requirements:

```typescript
// Apply auth middleware to all routes
router.use(authMiddleware);

// Now all routes below require authentication
router.get("/", listResources);
router.post("/", createResource);
```

Or at the individual route level for specific requirements:

```typescript
// Public routes
router.get("/", listProducts);
router.get("/:id", getProduct);

// Protected routes
router.post("/", authMiddleware, roleMiddleware(["admin", "vendor"]), createProduct);
router.put("/:id", authMiddleware, roleMiddleware(["admin", "vendor"]), updateProduct);
```

## Route Parameters

Use route parameters for resource identifiers:

```typescript
router.get("/:id", getResource);
router.get("/:userId/profile", getUserProfile);
```

## Query Parameters

Use query parameters for filtering, sorting, pagination:

```typescript
// The controller will handle query parameters like:
// GET /products?category=electronics&minPrice=100&maxPrice=500&page=1&limit=10&sort=price_asc
router.get("/", listProducts);
```

## Complete Example: Product Routes

```typescript
// routes/products.routes.ts
import { Router } from "express";
import { authMiddleware } from "../middlewares/auth.middleware";
import { roleMiddleware } from "../middlewares/role.middleware";

// Import product controllers
import { listProducts } from "../controllers/products.controllers/listProducts";
import { getProduct } from "../controllers/products.controllers/getProduct";
import { createProduct } from "../controllers/products.controllers/createProduct";
import { updateProduct } from "../controllers/products.controllers/updateProduct";
import { deleteProduct } from "../controllers/products.controllers/deleteProduct";

// Import review controllers
import { listProductReviews } from "../controllers/reviews.controllers/listProductReviews";
import { createProductReview } from "../controllers/reviews.controllers/createProductReview";
import { deleteProductReview } from "../controllers/reviews.controllers/deleteProductReview";

const router = Router();

// Public product routes
router.get("/", listProducts);
router.get("/:id", getProduct);

// Protected product routes (vendor/admin only)
router.post("/", authMiddleware, roleMiddleware(["admin", "vendor"]), createProduct);
router.put("/:id", authMiddleware, roleMiddleware(["admin", "vendor"]), updateProduct);
router.delete("/:id", authMiddleware, roleMiddleware(["admin", "vendor"]), deleteProduct);

// Nested review routes
router.get("/:productId/reviews", listProductReviews);
router.post("/:productId/reviews", authMiddleware, createProductReview);
router.delete("/:productId/reviews/:reviewId", authMiddleware, deleteProductReview);

export const productRoutes = router;
```

## Complete Example: Root Router

```typescript
// routes/index.ts
import { Router } from "express";
import { productRoutes } from "./products.routes";
import { userRoutes } from "./users.routes";
import { orderRoutes } from "./orders.routes";
import { businessRoutes } from "./business.routes";
import { authRoutes } from "./auth.routes";

const router = Router();

// API versioning
router.use("/api/v1/products", productRoutes);
router.use("/api/v1/users", userRoutes);
router.use("/api/v1/orders", orderRoutes);
router.use("/api/v1/businesses", businessRoutes);
router.use("/api/v1/auth", authRoutes);

export const apiRouter = router;
```

## Best Practices

1. **Use Descriptive Names**: Routes should clearly indicate the resource they represent.
2. **Consistent Pluralization**: Use plural nouns for collection resources (e.g., `/products` not `/product`).
3. **Avoid Verbs in URLs**: Use HTTP methods to indicate actions, not URL paths (e.g., `DELETE /products/:id` not `GET /products/delete/:id`).
4. **Versioning**: Consider versioning your API (`/api/v1/products`).
5. **Nesting Depth**: Limit nesting depth to keep URLs manageable (max 2-3 levels).
6. **Parameter Validation**: Delegate all parameter validation to controllers.
7. **Error Handling**: Let controllers and error middleware handle errors, not routes.
8. **Documentation**: Consider adding JSDoc comments to describe routes.