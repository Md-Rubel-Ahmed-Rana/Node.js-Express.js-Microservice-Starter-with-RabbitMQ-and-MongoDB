export type IPaginationOptions = {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
};

export type IFilterRequest = {
  searchQuery?: string;
  minPrice?: number;
  maxPrice?: number;
  offer?: string;
  discount?: string;
  categoryId?: string;
  stock?: "in" | "out";
  freeDelivery?: string;
};
