# Service Patterns

This document outlines the standard patterns and best practices for implementing services in our backend architecture.

## Service Structure

Every service file should:

1. Be in its own file in the appropriate resource folder (`{resource}.services/`)
2. Export a single function that handles one specific business operation
3. Contain all business logic related to that operation
4. Be free of validation and permission logic (these should be in controllers)
5. Return data or throw errors as appropriate

## Standard Service Pattern

```typescript
import { PrismaClient } from '@prisma/client';
import createHttpError from 'http-errors';

// Import any necessary types or utilities
import { SomeDataType } from '../../types/someTypes';

// Create service function
export const someService = async (data: SomeDataType, userId: string) => {
  // Business logic goes here
  // Database operations
  // External API calls
  // Data transformations

  // Return result
  return result;
};
```

## Service Responsibilities

Services SHOULD:
- Contain all business logic
- Perform database operations
- Make external API calls
- Transform data for response
- Handle business rule enforcement
- Throw appropriate errors for business rule violations

Services SHOULD NOT:
- Validate incoming request data
- Check user permissions
- Handle HTTP request/response objects
- Access request headers or cookies
- Set HTTP status codes

## Error Handling in Services

Services should throw errors for business logic failures. These will be caught by the controller's try/catch block.

```typescript
import createHttpError from 'http-errors';

export const getUserService = async (userId: string) => {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  
  if (!user) {
    throw createHttpError.notFound("User not found");
  }
  
  return user;
};
```

## Common Service Patterns

### Get Single Resource

```typescript
export const getProductService = async (productId: string) => {
  const product = await prisma.product.findUnique({
    where: { id: productId },
    include: {
      categories: true,
      reviews: {
        include: {
          user: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      },
    },
  });

  if (!product) {
    throw createHttpError.notFound("Product not found");
  }

  return product;
};
```

### List Resources

```typescript
export const listProductsService = async (filters: {
  page: number;
  limit: number;
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  search?: string;
}) => {
  const { page = 1, limit = 10, category, minPrice, maxPrice, search } = filters;
  
  const skip = (page - 1) * limit;
  
  const where: any = {};
  
  if (category) {
    where.categories = {
      some: {
        id: category,
      },
    };
  }
  
  if (minPrice !== undefined || maxPrice !== undefined) {
    where.price = {};
    
    if (minPrice !== undefined) {
      where.price.gte = minPrice;
    }
    
    if (maxPrice !== undefined) {
      where.price.lte = maxPrice;
    }
  }
  
  if (search) {
    where.OR = [
      { name: { contains: search, mode: 'insensitive' } },
      { description: { contains: search, mode: 'insensitive' } },
    ];
  }
  
  const [products, total] = await Promise.all([
    prisma.product.findMany({
      where,
      skip,
      take: limit,
      include: {
        categories: true,
      },
      orderBy: { createdAt: 'desc' },
    }),
    prisma.product.count({ where }),
  ]);
  
  return {
    products,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit),
    },
  };
};
```

### Create Resource

```typescript
export const createProductService = async (productData: {
  name: string;
  description: string;
  price: number;
  quantity: number;
  categories: string[];
  images?: string[];
}, vendorId: string) => {
  // Check if vendor exists
  const vendor = await prisma.vendor.findUnique({
    where: { id: vendorId },
  });
  
  if (!vendor) {
    throw createHttpError.badRequest("Vendor not found");
  }
  
  // Create product with transaction to ensure all related data is created
  const product = await prisma.$transaction(async (tx) => {
    // Create the product
    const newProduct = await tx.product.create({
      data: {
        name: productData.name,
        description: productData.description,
        price: productData.price,
        quantity: productData.quantity,
        vendor: {
          connect: { id: vendorId },
        },
        // Connect existing categories or create new ones
        categories: {
          connectOrCreate: productData.categories.map((category) => ({
            where: { name: category },
            create: { name: category },
          })),
        },
        // Add images if provided
        ...(productData.images && productData.images.length > 0
          ? {
              images: {
                createMany: {
                  data: productData.images.map((url) => ({ url })),
                },
              },
            }
          : {}),
      },
      include: {
        categories: true,
        images: true,
      },
    });

    return newProduct;
  });

  return product;
};
```

### Update Resource

```typescript
export const updateProductService = async (
  productId: string,
  productData: {
    name?: string;
    description?: string;
    price?: number;
    quantity?: number;
    categories?: string[];
    images?: string[];
  },
  vendorId: string
) => {
  // Check if product exists and belongs to the vendor
  const existingProduct = await prisma.product.findFirst({
    where: {
      id: productId,
      vendorId,
    },
  });

  if (!existingProduct) {
    throw createHttpError.notFound("Product not found or you don't have permission to update it");
  }

  // Update the product with transaction
  const updatedProduct = await prisma.$transaction(async (tx) => {
    let product = await tx.product.update({
      where: { id: productId },
      data: {
        ...(productData.name && { name: productData.name }),
        ...(productData.description && { description: productData.description }),
        ...(productData.price !== undefined && { price: productData.price }),
        ...(productData.quantity !== undefined && { quantity: productData.quantity }),
      },
      include: {
        categories: true,
        images: true,
      },
    });

    // Update categories if provided
    if (productData.categories && productData.categories.length > 0) {
      // Disconnect all existing categories
      await tx.product.update({
        where: { id: productId },
        data: {
          categories: {
            set: [], // Disconnect all
          },
        },
      });

      // Connect or create new categories
      product = await tx.product.update({
        where: { id: productId },
        data: {
          categories: {
            connectOrCreate: productData.categories.map((category) => ({
              where: { name: category },
              create: { name: category },
            })),
          },
        },
        include: {
          categories: true,
          images: true,
        },
      });
    }

    // Update images if provided
    if (productData.images && productData.images.length > 0) {
      // Delete all existing images
      await tx.productImage.deleteMany({
        where: { productId },
      });

      // Create new images
      await tx.productImage.createMany({
        data: productData.images.map((url) => ({
          url,
          productId,
        })),
      });

      // Refresh product to include new images
      product = await tx.product.findUnique({
        where: { id: productId },
        include: {
          categories: true,
          images: true,
        },
      });
    }

    return product;
  });

  return updatedProduct;
};
```

### Delete Resource

```typescript
export const deleteProductService = async (productId: string, vendorId: string) => {
  // Check if product exists and belongs to the vendor
  const existingProduct = await prisma.product.findFirst({
    where: {
      id: productId,
      vendorId,
    },
  });

  if (!existingProduct) {
    throw createHttpError.notFound("Product not found or you don't have permission to delete it");
  }

  // Delete the product with transaction to ensure all related data is deleted
  await prisma.$transaction(async (tx) => {
    // Delete product images
    await tx.productImage.deleteMany({
      where: { productId },
    });

    // Disconnect categories
    await tx.product.update({
      where: { id: productId },
      data: {
        categories: {
          set: [], // Disconnect all
        },
      },
    });

    // Delete product
    await tx.product.delete({
      where: { id: productId },
    });
  });

  return { success: true, message: "Product deleted successfully" };
};
```

## Transactions

Use transactions when multiple database operations need to succeed or fail together:

```typescript
const result = await prisma.$transaction(async (tx) => {
  // Multiple database operations that should be atomic
  const user = await tx.user.create({ data: userData });
  const profile = await tx.profile.create({ 
    data: { 
      ...profileData,
      userId: user.id 
    } 
  });
  
  return { user, profile };
});
```

## Error Handling

Handle specific database errors with appropriate messages:

```typescript
try {
  const user = await prisma.user.create({
    data: {
      email: userData.email,
      name: userData.name,
    },
  });
  
  return user;
} catch (error) {
  if (error.code === 'P2002' && error.meta?.target?.includes('email')) {
    throw createHttpError.conflict("Email already in use");
  }
  
  // Re-throw other errors
  throw error;
}
```

## Performance Considerations

- Use `select` to only retrieve needed fields
- Use appropriate indexes for frequently queried fields
- Use pagination for large result sets
- Use batch operations when possible
- Consider caching for frequently accessed, rarely changed data