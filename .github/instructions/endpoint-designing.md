# AI Context Management System

This system provides tools for creating, storing, and retrieving AI-related context data in individual files, ensuring that each context is stored separately with its own timestamp.

## Features

- Creates a new file for each context with timestamp in the filename
- Supports different context types (search, product recommendations, user interactions, etc.)
- Provides utility functions for retrieving contexts by type
- Includes API endpoints for saving different types of context data

## Directory Structure

Context files are stored in:

```
/backend/ai/contexts/
```

Each file is named with a pattern: `{type}_{timestamp}.json`

## API Endpoints

The following API endpoints are available:

- `POST /api/ai/context/search` - Save search context (public, user ID optional)
- `POST /api/ai/context/recommendations` - Save product recommendation context (private)
- `POST /api/ai/context/interaction` - Save user interaction context (private)

## Usage Example

```typescript
import { AIContextService } from '../services/aiContext.service';

// Save search context
const searchResults = [...];
const searchQuery = "blue jeans";
const userId = "user_123";  // Optional

AIContextService.saveSearchContext(userId, searchQuery, searchResults);

// Save product recommendation context
const products = [...];
const userPreferences = {...};
const userId = "user_123";  // Required

AIContextService.saveProductRecommendationContext(userId, products, userPreferences);

// Save user interaction context
const action = "add_to_cart";
const data = { productId: "product_123", quantity: 2 };
const userId = "user_123";  // Required

AIContextService.saveUserInteractionContext(userId, action, data);
```

## Low-Level API

If you need more flexibility, you can use the lower-level utilities:

```typescript
import { createContext, getContextsByType } from '../utils/aiContext';

// Create a custom context
const myContext = { /* your data here */ };
const filePath = createContext(myContext, 'my-custom-type');

// Retrieve contexts
const recentContexts = getContextsByType('my-custom-type', 10); // limit to 10 most recent
```

## Running the Test

There's a test file available to demonstrate the functionality:

```bash
cd backend
npx tsx src/test/ai/contextTest.ts
```

This will create several test context files and retrieve them, demonstrating how the system works.