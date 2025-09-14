# Backend Architecture Guide

## 1. Folder Structure & Responsibilities

### routes/
- Each file defines the routes for a specific resource (e.g., `business.routes.ts`, `orders.routes.ts`).
- Only routing logic: import controllers and assign them to endpoints.
- No business logic or validation here.

### controllers/
- Each resource (route) has its own folder: `{resource}.controllers/` (e.g., `business.controllers/`).
- Each file inside is a single controller (one function per file).
- Controllers:
  - Only handle validation and permission checks.
  - Use validation schemas from `validators/`.
  - Throw errors using `createHttpError` from "http-errors" if validation or permissions fail.
  - After validation/permissions, call the appropriate service.
  - Always wrap all logic in try/catch blocks and call `next(err)` in catch blocks.

### services/
- Each resource has its own folder: `{resource}.services/` (e.g., `business.services/`).
- Each file contains a single service function.
- Services contain business logic and interact with the database or other APIs.
- No validation or permission logic here.

### validators/
- Each resource has its own folder: `{resource}.validations/` (e.g., `business.validations/`).
- Each file exports a Zod object schema for a specific controller.
- Validation files export an object with possible keys: `body`, `query`, `params`.
- Each Zod object:
  - Has detailed error messages for each field.
  - Use second parameter with error property for object-level validation messages.

## 2. Example Structure

```
backend/
  src/
    routes/
      business.routes.ts
      orders.routes.ts
      ...
    controllers/
      business.controllers/
        listMyBusinesses.ts
        createBusiness.ts
        ...
    services/
      business.services/
        listMyBusinessesService.ts
        createBusinessService.ts
        ...
    validators/
      business.validations/
        listMyBusinessesValidators.ts
        createBusinessValidators.ts
        ...
```

## 3. Controller Example

```ts
// controllers/business.controllers/listMyBusinesses.ts
import { listMyBusinessesValidators } from "../../validators/business.validations/listMyBusinessesValidators";
import createHttpError from "http-errors";
import { listMyBusinessesService } from "../../services/business.services/listMyBusinessesService";

export const listMyBusinesses = async (req, res, next) => {
  try {
    const validation = listMyBusinessesValidators.query.safeParse(req.query);
    if (!validation.success) {
      throw createHttpError(400, validation.error.errors[0]?.message || "Invalid query parameters");
    }

    // Permission check (example)
    if (!req.user?.isAdmin) {
      throw createHttpError.unauthorized("Please login with appropriate permissions");
    }

    const businesses = await listMyBusinessesService(validation.data);
    res.json(businesses);
  } catch (err) {
    next(err);
  }
};
```

## 4. Validator Example

```ts
// validators/business.validations/listMyBusinessesValidators.ts
import { z } from "zod";

export const listMyBusinessesValidators = {
  query: z.object({
    page: z.number().min(1, { message: "Page must be at least 1" }),
    limit: z.number().min(1, { message: "Limit must be at least 1" }),
  }, { errorMap: (_, ctx) => {
      return { message: ctx.defaultError || "Query is empty" };
    }
  }),
};
```

## 5. Service Example

```ts
// services/business.services/listMyBusinessesService.ts
export const listMyBusinessesService = async ({ page, limit }) => {
  // Business logic, DB calls, etc.
  // No validation or permission checks here - that's the controller's responsibility
  // Just pure business logic related to the feature
};
```

## 6. Routes Example

```ts
// routes/business.routes.ts
import { Router } from "express";
import { listMyBusinesses } from "../controllers/business.controllers/listMyBusinesses";
import { createBusiness } from "../controllers/business.controllers/createBusiness";
import { authMiddleware } from "../middlewares/auth.middleware";

const router = Router();

router.get("/", authMiddleware, listMyBusinesses);
router.post("/", authMiddleware, createBusiness);

export const businessRoutes = router;
```

## 7. General Best Practices

### Error Handling
- Controllers should wrap all logic in try/catch blocks.
- Use `throw createHttpError.unauthorized("Please login")` syntax for throwing errors.
- Common error types: `createHttpError.badRequest(msg)`, `createHttpError.unauthorized(msg)`, `createHttpError.forbidden(msg)`, `createHttpError.notFound(msg)`.
- Always pass errors to the `next()` function in catch blocks.

### Validation
- Use Zod for validation schemas.
- Always provide clear, user-friendly error messages for each field.
- Use object-level error messages for empty objects or general validation failures.
- Structure validation objects with possible keys: `body`, `query`, `params`.

### Controllers
- One controller per file.
- Only validation, permission checks, and calling services.
- No direct database access or business logic.
- Always use try/catch and pass errors to next().

### Services
- One service function per file.
- Contains all business logic.
- Can access database directly.
- No validation or permission checks - assume data is validated.
- Can throw errors that will be caught by the controller.

### Routes
- One file per resource.
- Only import controllers and assign to endpoints.
- Apply middleware as needed (auth, etc.).
- Keep route definitions clean and simple.

### Permissions
- Check permissions in controllers, not in services.
- Use middleware for common permission checks.
- Throw proper error types for permission failures.

## 8. Example Workflow

1. Request comes in to a route (e.g., GET /businesses)
2. Route handler calls the appropriate controller
3. Controller validates request data using schemas from validators
4. Controller checks permissions
5. If validation/permissions pass, controller calls the appropriate service
6. Service performs business logic and returns result
7. Controller sends response
8. If any errors occur, they're caught and passed to error middleware

## 9. Directory Structure Full Example

```
backend/
  src/
    app.ts                 # Express app setup
    server.ts              # Server entry point
    config/                # Configuration files
      auth.ts
      logger.ts
      permissions.ts
      prisma.ts
      redis.ts
      s3.ts
      smtp.ts
    routes/                # Route definitions
      business.routes.ts
      orders.routes.ts
      products.routes.ts
      users.routes.ts
    controllers/           # Request handlers
      business.controllers/
        listMyBusinesses.ts
        createBusiness.ts
        getBusiness.ts
        updateBusiness.ts
        deleteBusiness.ts
      orders.controllers/
        ...
    services/              # Business logic
      business.services/
        listMyBusinessesService.ts
        createBusinessService.ts
        getBusinessService.ts
        updateBusinessService.ts
        deleteBusinessService.ts
      orders.services/
        ...
    validators/            # Validation schemas
      business.validations/
        listMyBusinessesValidators.ts
        createBusinessValidators.ts
        getBusinessValidators.ts
        updateBusinessValidators.ts
        deleteBusinessValidators.ts
      orders.validations/
        ...
    middlewares/           # Middleware functions
      auth.middleware.ts
      error.middleware.ts
      logger.middleware.ts
    utils/                 # Utility functions
      format.ts
      helpers.ts
    types/                 # TypeScript type definitions
      env.d.ts
      express.d.ts
```