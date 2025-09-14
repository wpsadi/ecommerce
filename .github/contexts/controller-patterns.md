# Controller Design Patterns

This document outlines the standard patterns and best practices for implementing controllers in our backend architecture.

## Controller Structure

Every controller should:

1. Be in its own file in the appropriate resource folder (`{resource}.controllers/`)
2. Export a single function that handles one specific endpoint
3. Follow the try/catch pattern for error handling
4. Use validators from the validation layer
5. Check permissions
6. Call the appropriate service function
7. Return a response

## Error Handling Pattern

All controllers must use the following error handling pattern:

```typescript
// Import the appropriate validator and service
import { someValidator } from "../../validators/{resource}.validations/someValidator";
import { someService } from "../../services/{resource}.services/someService";
import createHttpError from "http-errors";

export const someController = async (req, res, next) => {
  try {
    // Validation logic
    const validation = someValidator.body.safeParse(req.body);
    if (!validation.success) {
      throw createHttpError(400, validation.error.errors[0]?.message || "Invalid request body");
    }

    // Permission checks
    if (!req.user) {
      throw createHttpError.unauthorized("Please login to continue");
    }
    
    if (!req.user.hasPermission) {
      throw createHttpError.forbidden("You don't have permission to perform this action");
    }

    // Call service
    const result = await someService(validation.data, req.user);
    
    // Send response
    res.status(200).json(result);
  } catch (err) {
    // Pass all errors to error middleware
    next(err);
  }
};
```

## Error Types

Use the appropriate error type based on the situation:

- `createHttpError.badRequest(message)` - 400 - Bad request, validation errors
- `createHttpError.unauthorized(message)` - 401 - User not logged in
- `createHttpError.forbidden(message)` - 403 - User lacks permission
- `createHttpError.notFound(message)` - 404 - Resource not found
- `createHttpError(statusCode, message)` - For other status codes

## Controller Responsibilities

Controllers SHOULD:
- Validate incoming data
- Check permissions
- Call service functions
- Return responses
- Handle errors

Controllers SHOULD NOT:
- Contain business logic
- Make database queries directly
- Implement complex data transformations
- Handle file storage/upload logic directly

## Example Controllers

### Get Resource Controller
```typescript
// controllers/products.controllers/getProduct.ts
import { getProductValidator } from "../../validators/products.validations/getProductValidator";
import { getProductService } from "../../services/products.services/getProductService";
import createHttpError from "http-errors";

export const getProduct = async (req, res, next) => {
  try {
    const validation = getProductValidator.params.safeParse(req.params);
    if (!validation.success) {
      throw createHttpError(400, validation.error.errors[0]?.message || "Invalid product ID");
    }

    const product = await getProductService(validation.data.id);
    
    if (!product) {
      throw createHttpError.notFound("Product not found");
    }
    
    res.json(product);
  } catch (err) {
    next(err);
  }
};
```

### Create Resource Controller
```typescript
// controllers/products.controllers/createProduct.ts
import { createProductValidator } from "../../validators/products.validations/createProductValidator";
import { createProductService } from "../../services/products.services/createProductService";
import createHttpError from "http-errors";

export const createProduct = async (req, res, next) => {
  try {
    const validation = createProductValidator.body.safeParse(req.body);
    if (!validation.success) {
      throw createHttpError(400, validation.error.errors[0]?.message || "Invalid product data");
    }

    if (!req.user) {
      throw createHttpError.unauthorized("Please login to create a product");
    }
    
    if (!req.user.isVendor) {
      throw createHttpError.forbidden("Only vendors can create products");
    }

    const product = await createProductService(validation.data, req.user.id);
    
    res.status(201).json(product);
  } catch (err) {
    next(err);
  }
};
```