# Validation Patterns

This document outlines the standard patterns and best practices for implementing validations in our backend architecture.

## Validation Structure

Every validation file should:

1. Be in its own file in the appropriate resource folder (`{resource}.validations/`)
2. Export an object with possible keys: `body`, `query`, `params`, each containing a Zod schema
3. Include detailed error messages for each field
4. Include object-level error messages for empty objects or general validation failures

## Standard Zod Pattern

```typescript
import { z } from "zod";

export const someValidator = {
  body: z.object({
    field1: z.string({
      required_error: "Field1 is required",
      invalid_type_error: "Field1 must be a string",
    }).min(3, { message: "Field1 must be at least 3 characters long" }),
    
    field2: z.number({
      required_error: "Field2 is required",
      invalid_type_error: "Field2 must be a number",
    }).min(1, { message: "Field2 must be at least 1" }),
    
    // More fields...
  }, { 
    errorMap: (_, ctx) => {
      return { message: ctx.defaultError || "Request body is empty or invalid" };
    }
  }),
  
  query: z.object({
    // Query parameters validation
  }, {
    errorMap: (_, ctx) => {
      return { message: ctx.defaultError || "Query parameters are empty or invalid" };
    }
  }),
  
  params: z.object({
    // URL parameters validation
  }, {
    errorMap: (_, ctx) => {
      return { message: ctx.defaultError || "URL parameters are invalid" };
    }
  }),
};
```

## Common Validation Patterns

### ID Validation

```typescript
id: z.string({
  required_error: "ID is required",
  invalid_type_error: "ID must be a string",
}).refine((val) => /^[0-9a-fA-F]{24}$/.test(val), {
  message: "Invalid ID format",
})
```

### String Validation

```typescript
name: z.string({
  required_error: "Name is required",
  invalid_type_error: "Name must be a string",
}).min(3, { message: "Name must be at least 3 characters long" })
  .max(100, { message: "Name must not exceed 100 characters" })
  .trim(),
```

### Email Validation

```typescript
email: z.string({
  required_error: "Email is required",
  invalid_type_error: "Email must be a string",
}).email({ message: "Invalid email format" }),
```

### Number Validation

```typescript
price: z.number({
  required_error: "Price is required",
  invalid_type_error: "Price must be a number",
}).min(0, { message: "Price must be at least 0" }),
```

### Boolean Validation

```typescript
isActive: z.boolean({
  required_error: "Active status is required",
  invalid_type_error: "Active status must be a boolean",
}),
```

### Date Validation

```typescript
birthDate: z.date({
  required_error: "Birth date is required",
  invalid_type_error: "Birth date must be a valid date",
}).refine((date) => date <= new Date(), {
  message: "Birth date cannot be in the future",
}),
```

### Array Validation

```typescript
tags: z.array(
  z.string({
    required_error: "Tag is required",
    invalid_type_error: "Tag must be a string",
  }).min(1, { message: "Tag cannot be empty" })
, { 
  required_error: "Tags is required",
  invalid_type_error: "Tags must be an array",
}).min(1, { message: "At least one tag is required" }),
```

### Object Validation

```typescript
address: z.object({
  street: z.string({ required_error: "Street is required" })
    .min(3, { message: "Street must be at least 3 characters long" }),
  city: z.string({ required_error: "City is required" })
    .min(2, { message: "City must be at least 2 characters long" }),
  zipCode: z.string({ required_error: "Zip code is required" })
    .refine((val) => /^\d{5}(-\d{4})?$/.test(val), {
      message: "Invalid zip code format",
    }),
}, {
  required_error: "Address is required",
  invalid_type_error: "Address must be an object",
}),
```

### Optional Fields

```typescript
description: z.string({
  invalid_type_error: "Description must be a string",
}).min(10, { message: "Description must be at least 10 characters long" })
  .optional(),
```

### Enum Validation

```typescript
role: z.enum(["admin", "user", "vendor"], {
  required_error: "Role is required",
  invalid_type_error: "Role must be one of: admin, user, vendor",
}),
```

## Complete Example

```typescript
// validators/products.validations/createProductValidator.ts
import { z } from "zod";

export const createProductValidator = {
  body: z.object({
    name: z.string({
      required_error: "Product name is required",
      invalid_type_error: "Product name must be a string",
    }).min(3, { message: "Product name must be at least 3 characters long" })
      .max(100, { message: "Product name must not exceed 100 characters" }),
    
    description: z.string({
      required_error: "Product description is required",
      invalid_type_error: "Product description must be a string",
    }).min(10, { message: "Product description must be at least 10 characters long" }),
    
    price: z.number({
      required_error: "Product price is required",
      invalid_type_error: "Product price must be a number",
    }).min(0, { message: "Product price must be at least 0" }),
    
    quantity: z.number({
      required_error: "Product quantity is required",
      invalid_type_error: "Product quantity must be a number",
    }).int({ message: "Product quantity must be an integer" })
      .min(0, { message: "Product quantity must be at least 0" }),
    
    categories: z.array(
      z.string({
        invalid_type_error: "Category must be a string",
      }).min(1, { message: "Category cannot be empty" })
    , { 
      required_error: "Categories are required",
      invalid_type_error: "Categories must be an array",
    }).min(1, { message: "At least one category is required" }),
    
    images: z.array(
      z.string({
        invalid_type_error: "Image URL must be a string",
      }).url({ message: "Invalid image URL" })
    ).optional(),
  }, {
    errorMap: (_, ctx) => {
      return { message: ctx.defaultError || "Product data is empty or invalid" };
    }
  }),
};
```