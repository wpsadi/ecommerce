# S3 Storage Context

## S3 File Location Conventions

- **Business Images:**
  - All images related to a business are stored at:
    - `/business/{businessID}`

- **Product Images:**
  - All images related to a product are stored at:
    - `/business/{businessID}/product/{productID}/images`

## S3 Client Configuration

- S3 is configured using the `S3Client` from the `bun` runtime.
- See `src/config/s3.ts` for setup details.

# Project Architecture Summary

This document provides a comprehensive overview of the project architecture and best practices to follow when developing the backend of our e-commerce application.

## Directory Structure

```
backend/
  src/
    app.ts                 # Express app setup
    server.ts              # Server entry point
    config/                # Configuration files
    routes/                # Route definitions
      {resource}.routes.ts  # e.g., business.routes.ts
    controllers/           # Request handlers
      {resource}.controllers/ # e.g., business.controllers/
        {action}.ts        # e.g., listMyBusinesses.ts
    services/              # Business logic
      {resource}.services/ # e.g., business.services/
        {action}Service.ts # e.g., listMyBusinessesService.ts
    validators/            # Validation schemas
      {resource}.validations/ # e.g., business.validations/
        {action}Validators.ts # e.g., listMyBusinessesValidators.ts
    middlewares/           # Middleware functions
    utils/                 # Utility functions
    types/                 # TypeScript type definitions
```

## Key Principles

1. **Separation of Concerns**: Each layer has a specific responsibility:
   - Routes: Define endpoints and connect to controllers
   - Controllers: Handle validation, permissions, and error management
   - Services: Implement business logic
   - Validators: Define data validation rules

2. **Single Responsibility**: Each file should handle one specific task:
   - One controller function per file
   - One service function per file
   - One validator schema per file

3. **Error Handling**: All errors are caught in controllers and passed to error middleware:
   - Use try/catch blocks in controllers
   - Throw specific HTTP errors (`createHttpError`)
   - Pass errors to next() for centralized handling

4. **Validation**: All input is validated in controllers using Zod schemas:
   - Provide clear error messages
   - Validate query parameters, request body, and URL parameters
   - Use object-level validation for empty objects

## Flow of a Request

1. Request arrives at a route
2. Route calls the appropriate controller
3. Controller validates the request using validator schemas
4. Controller checks permissions
5. Controller calls the appropriate service
6. Service performs business logic and returns data
7. Controller sends response or passes error to middleware

## Detailed Documentation

For more detailed information, please refer to these specific guides:

- [Backend Architecture Guide](/workspaces/ecommerce/backend/src/ai/contexts/backend-architecture.md)
- [Controller Patterns](/workspaces/ecommerce/backend/src/ai/contexts/controller-patterns.md)
- [Service Patterns](/workspaces/ecommerce/backend/src/ai/contexts/service-patterns.md)
- [Validation Patterns](/workspaces/ecommerce/backend/src/ai/contexts/validation-patterns.md)
- [Routes Patterns](/workspaces/ecommerce/backend/src/ai/contexts/routes-patterns.md)

## Example Implementation Flow

Here's a complete flow example for a "list my businesses" feature:

1. Route definition in `routes/business.routes.ts`:
   ```typescript
   router.get("/", authMiddleware, listMyBusinesses);
   ```

2. Controller in `controllers/business.controllers/listMyBusinesses.ts`:
   ```typescript
   export const listMyBusinesses = async (req, res, next) => {
     try {
       const validation = listMyBusinessesValidators.query.safeParse(req.query);
       if (!validation.success) {
         throw createHttpError(400, validation.error.errors[0]?.message || "Invalid query parameters");
       }

       if (!req.user) {
         throw createHttpError.unauthorized("Please login to continue");
       }

       const businesses = await listMyBusinessesService(validation.data, req.user.id);
       res.json(businesses);
     } catch (err) {
       next(err);
     }
   };
   ```

3. Validator in `validators/business.validations/listMyBusinessesValidators.ts`:
   ```typescript
   export const listMyBusinessesValidators = {
     query: z.object({
       page: z.number().min(1, { message: "Page must be at least 1" }),
       limit: z.number().min(1, { message: "Limit must be at least 1" }),
     }, { 
       errorMap: (_, ctx) => {
         return { message: ctx.defaultError || "Query is empty" };
       }
     }),
   };
   ```

4. Service in `services/business.services/listMyBusinessesService.ts`:
   ```typescript
   export const listMyBusinessesService = async (
     { page, limit }: { page: number; limit: number }, 
     userId: string
   ) => {
     const skip = (page - 1) * limit;
     
     const [businesses, total] = await Promise.all([
       prisma.business.findMany({
         where: { userId },
         skip,
         take: limit,
         orderBy: { createdAt: 'desc' },
       }),
       prisma.business.count({ where: { userId } }),
     ]);
     
     return {
       businesses,
       pagination: {
         page,
         limit,
         total,
         pages: Math.ceil(total / limit),
       },
     };
   };
   ```