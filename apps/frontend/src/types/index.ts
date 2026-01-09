export enum UserRole {
  consumer = 'consumer',
  supermarket = 'supermarket',
  admin = 'admin',
}

export enum UserStatus {
  active = 'active',
  inactive = 'inactive',
  suspended = 'suspended',
  pending = 'pending',
}

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  status: UserStatus;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  user: User;
}

export interface LoginDto {
  email: string;
  password: string;
}

export interface RegisterDto {
  name: string;
  email: string;
  password: string;
  role?: UserRole;
}

export interface CreateSupermarketDto {
  companyName: string;
  tradingName?: string;
  cnpj: string;
  addressStreet: string;
  addressNumber: string;
  addressComplement?: string;
  addressNeighborhood: string;
  addressCity: string;
  addressState: string;
  addressZipcode: string;
  addressLat: number;
  addressLng: number;
  email: string;
  password: string;
  phone?: string;
  website?: string;
  logoUrl?: string;
  description?: string;
}

export interface Product {
  id: string;
  name: string;
  description?: string;
  barcode?: string;
  brand?: string;
  unit: string;
  quantity: number;
  priceCents: number;
  promoPriceCents?: number;
  promoStartDate?: string;
  promoEndDate?: string;
  imageUrl?: string;
  categoryId: string;
  supermarketId: string;
  isFeatured: boolean;
  status: string;
  createdAt: string;
}

export interface ShoppingList {
  id: string;
  userId: string;
  name: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  items: ListItem[];
  totalCents?: number;
  totalItems?: number;
}

export interface ListItem {
  id: string;
  listId: string;
  productId: string;
  quantity: number;
  isChecked: boolean;
  product: Product;
}

export interface ComparisonResult {
  id: string;
  listId: string;
  results: SupermarketComparison[];
  cheapest: {
    supermarketId: string;
    supermarketName: string;
    total: number;
    savings: number;
    savingsPercentage: string;
  };
  createdAt: string;
}

export interface SupermarketComparison {
  supermarketId: string;
  supermarketName: string;
  tradingName?: string;
  distance?: number;
  items: ProductComparison[];
  subtotal: number;
  unavailableCount: number;
  availableCount: number;
}

export interface ProductComparison {
  productId: string;
  name: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  available: boolean;
}
