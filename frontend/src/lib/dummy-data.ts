import type { User } from "better-auth";
import type { OrganizationInput } from "better-auth/plugins/organization";
import type { CartItem } from "@/store/cart.store";
import type { Business, Order, Product } from "@/types/type";

// Dummy users
export const dummyUsers: User[] = [
  {
    id: "1",
    email: "john@example.com",
    name: "John Doe",
    image: "/diverse-user-avatars.png",
    createdAt: new Date("2024-01-01"),
    updatedAt: new Date("2024-01-01"),
    emailVerified: false,
  },
  {
    id: "2",
    email: "jane@example.com",
    name: "Jane Smith",
    image: "/female-user-avatar.png",
    createdAt: new Date("2024-01-02"),
    updatedAt: new Date("2024-01-02"),
    emailVerified: false,
  },
];

// Dummy organizations
export const dummyOrganizations: OrganizationInput[] = [
  {
    id: "1",
    name: "Artisan Collective",
    logo: "/artisan-logo.jpg",
    slug: "artisan-collective",
    metadata: {},
    createdAt: new Date("2024-01-01"),
  },
];

// Dummy businesses
export const dummyBusinesses: Business[] = [
  {
    id: "1",
    name: "Ceramic Studio",
    description: "Handcrafted ceramic vases and pottery",

    organizationId: "1",
    organization: {
      id: "1",
      name: "Artisan Collective",
      logo: "/artisan-logo.jpg",
      slug: "artisan-collective",
      metadata: {},
      createdAt: new Date("2024-01-01"),
    },
    BusinesPaymentInfo: {
      businessId: "1",
      id: "101",
      createdAt: new Date("2024-01-01"),
      updatedAt: new Date("2024-01-01"),
      upiId: "ceramicstudio@paytm",
    },
    address: "123 Ceramic Lane, Pottery Town",
    phone: "+91-9876543210",
    businessType: "COMPANY",
    email: "contact@ceramicstudio.com",
    website: "https://ceramicstudio.com",
    isAllowed: true,
    isVerified: true,
    createdAt: new Date("2024-01-01"),
    updatedAt: new Date("2024-01-01"),
  },
  {
    id: "2",
    name: "Furniture Craft",
    description: "Modern and minimalist furniture designs",
    organizationId: "2",
    organization: {
      id: "2",
      name: "Furniture Makers Guild",
      logo: "/furniture-guild-logo.jpg",
      slug: "furniture-makers-guild",
      metadata: {},
      createdAt: new Date("2024-01-02"),
    },
    BusinesPaymentInfo: {
      businessId: "2",
      id: "102",
      createdAt: new Date("2024-01-02"),
      updatedAt: new Date("2024-01-02"),
      upiId: "furniturecraft@gpay",
    },
    address: "456 Furniture Avenue, Design City",
    phone: "+91-8765432109",
    businessType: "COMPANY",
    email: "support@furniturecraft.com",
    website: "https://furniturecraft.com",
    isAllowed: true,
    isVerified: true,
    createdAt: new Date("2024-01-02"),
    updatedAt: new Date("2024-01-02"),
  },
];

// Dummy products
export const dummyProducts: Product[] = [
  {
    id: "1",
    name: "Ceramic Vase Collection",
    description: `# Ceramic Vase Collection

## About This Collection
Our ceramic vase collection features **handcrafted pieces** that blend traditional techniques with contemporary design.

### Features
- Hand-thrown on pottery wheel
- Glazed with natural materials
- Available in multiple sizes
- Perfect for fresh or dried flowers

### Care Instructions
- Hand wash with mild soap
- Avoid extreme temperature changes
- Handle with care

*Each piece is unique and may vary slightly from the images.*`,
    price: 299900, // ₹2,999.00 in paise
    quantity: 15,
    mainImage: "/ceramic-vase-collection.png",
    sideImages: [
      "/ceramic-vase-side.png",
      "/ceramic-vase-top-view.jpg",
      "/ceramic-vase-in-room-setting.jpg",
    ],
    video: "/placeholder.mp4?query=ceramic making process",
    business: {
      id: "1",
      name: "Ceramic Studio",
    },
    createdAt: new Date("2024-01-01").toDateString(),
    updatedAt: new Date("2024-01-01").toDateString(),
  },
  {
    id: "2",
    name: "Geometric Bookshelf",
    description: `# Geometric Bookshelf

## Design Philosophy
This bookshelf embodies **minimalist design** principles with its clean geometric form and functional beauty.

### Specifications
- Material: Premium engineered wood
- Dimensions: 180cm H x 80cm W x 30cm D
- Weight capacity: 50kg per shelf
- Assembly required

### Features
- 6 spacious compartments
- Anti-tip safety mechanism
- Scratch-resistant finish
- Modern geometric design

Perfect for **modern living spaces** and home offices.`,
    price: 1599900, // ₹15,999.00 in paise
    quantity: 8,
    mainImage: "/geometric-bookshelf-modern.jpg",
    sideImages: [
      "/bookshelf-with-books.png",
      "/bookshelf-assembly.jpg",
      "/bookshelf-in-living-room.jpg",
    ],
    video: "",
    business: {
      id: "2",
      name: "Furniture Craft",
    },
    createdAt: new Date("2024-01-02").toDateString(),
    updatedAt: new Date("2024-01-02").toDateString(),
  },
  {
    id: "3",
    name: "Minimalist Walnut Dining Table",
    description: `# Minimalist Walnut Dining Table

## Craftsmanship
Crafted from **solid walnut wood**, this dining table represents the pinnacle of minimalist furniture design.

### Materials
- 100% solid walnut wood
- Natural oil finish
- Handcrafted joinery
- No metal hardware

### Dimensions
- Length: 180cm
- Width: 90cm  
- Height: 75cm
- Seats: 6 people comfortably

### Care
- Dust regularly with soft cloth
- Apply wood oil annually
- Use coasters and placemats
- Avoid direct sunlight

*This table will develop a beautiful patina over time.*`,
    price: 4999900, // ₹49,999.00 in paise
    quantity: 3,
    mainImage: "/walnut-dining-table-minimalist.jpg",
    sideImages: [
      "/dining-table-with-chairs.jpg",
      "/walnut-wood-grain-detail.jpg",
      "/dining-room-setup.jpg",
    ],
    video: "",
    business: {
      id: "2",
      name: "Furniture Craft",
    },
    createdAt: new Date("2024-01-03").toDateString(),
    updatedAt: new Date("2024-01-03").toDateString(),
  },
];

// Dummy cart items
export const dummyCartItems: CartItem[] = [
  {
    productId: "1",
    quantity: 2,
  },
  {
    productId: "2",
    quantity: 1,
  },
];

// Dummy orders
export const dummyOrders: Order[] = [
  {
    id: "1",
    userId: "1",
    user: {
      id: "1",
      email: "john@example.com",
      name: "John Doe",
    },
    items: [
      {
        id: "1",
        productId: "1",
        quantity: 1,
        price: 299900,
        orderId: "1",
        product: {
          id: "1",
          name: "Ceramic Vase Collection",
          description: `# Ceramic Vase Collection

## About This Collection
Our ceramic vase collection features **handcrafted pieces** that blend traditional techniques with contemporary design.

### Features
- Hand-thrown on pottery wheel
- Glazed with natural materials
- Available in multiple sizes
- Perfect for fresh or dried flowers

### Care Instructions
- Hand wash with mild soap
- Avoid extreme temperature changes
- Handle with care

*Each piece is unique and may vary slightly from the images.*`,
          price: 299900,
          quantity: 15,
          mainImage: "/ceramic-vase-collection.png",
          sideImages: [
            "/ceramic-vase-side.png",
            "/ceramic-vase-top-view.jpg",
            "/ceramic-vase-in-room-setting.jpg",
          ],
          video: "/placeholder.mp4?query=ceramic making process",
          business: {
            id: "1",
            name: "Ceramic Studio",
          },
          businessId: "1",
          createdAt: new Date("2024-01-01"),
          updatedAt: new Date("2024-01-01"),
        },
      },
    ],
    totalAmount: 299900,
    status: "delivered",
    razorpayOrderId: null,
    razorpayPaymentId: null,
    razorpaySignature: null,
    createdAt: new Date("2024-01-05"),
    updatedAt: new Date("2024-01-08"),
  },
  {
    id: "2",
    userId: "1",
    user: {
      id: "1",
      email: "john@example.com",
      name: "John Doe",
    },
    items: [
      {
        id: "2",
        productId: "2",
        quantity: 1,
        price: 1599900,
        orderId: "2",
        product: {
          id: "2",
          name: "Geometric Bookshelf",
          description: `# Geometric Bookshelf

## Design Philosophy
This bookshelf embodies **minimalist design** principles with its clean geometric form and functional beauty.

### Specifications
- Material: Premium engineered wood
- Dimensions: 180cm H x 80cm W x 30cm D
- Weight capacity: 50kg per shelf
- Assembly required

### Features
- 6 spacious compartments
- Anti-tip safety mechanism
- Scratch-resistant finish
- Modern geometric design

Perfect for **modern living spaces** and home offices.`,
          price: 1599900,
          quantity: 8,
          mainImage: "/geometric-bookshelf-modern.jpg",
          sideImages: [
            "/bookshelf-with-books.png",
            "/bookshelf-assembly.jpg",
            "/bookshelf-in-living-room.jpg",
          ],
          video: "",
          business: {
            id: "2",
            name: "Furniture Craft",
          },
          businessId: "2",
          createdAt: new Date("2024-01-02"),
          updatedAt: new Date("2024-01-02"),
        },
      },
    ],
    totalAmount: 1599900,
    status: "shipped",
    razorpayOrderId: null,
    razorpayPaymentId: null,
    razorpaySignature: null,
    createdAt: new Date("2024-01-12"),
    updatedAt: new Date("2024-01-13"),
  },
];
