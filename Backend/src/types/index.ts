export interface AuthRequest extends Request {
  user?: {
    id: string;
    email: string;
    role: string;
  };
}

export interface CreateSweetRequest {
  name: string;
  category: string;
  price: number;
  quantity: number;
  description?: string;
}

export interface UpdateSweetRequest {
  name?: string;
  category?: string;
  price?: number;
  quantity?: number;
  description?: string;
}

export interface SearchSweetQuery {
  name?: string;
  category?: string;
  minPrice?: string;
  maxPrice?: string;
}