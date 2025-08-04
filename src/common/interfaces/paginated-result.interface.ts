// === FILE: server/src/common/interfaces/paginated-result.interface.ts ===

export interface PaginatedResult<T> {
  data: T[];          // Array of paginated items
  count: number;      // Total number of items available
  page?: number;      // Current page number (optional)
  limit?: number;     // Number of items per page (optional)
  totalPages?: number; // Total number of pages (optional)
}

// Optional: You might want to add these utility types as well
export interface PaginationOptions {
  page: number;
  limit: number;
}

export interface PaginationMeta {
  totalItems: number;
  itemCount: number;
  itemsPerPage: number;
  totalPages: number;
  currentPage: number;
}

export interface PaginatedResponse<T> {
  items: T[];
  meta: PaginationMeta;
}