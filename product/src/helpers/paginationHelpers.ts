import { SortOrder } from "mongoose";

type IOptions = {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: SortOrder;
};

type IReturnOptions = {
  page: number;
  limit: number;
  skip: number;
  sortBy: string;
  sortOrder: SortOrder;
};

const calculatePagination = (options: IOptions): IReturnOptions => {
  const page = Number(options?.page || 1);
  const limit = Number(options?.limit || 10);
  const sortBy = options.sortBy || "createdAt";
  const sortOrder = options.sortOrder || "desc";

  const skip = (page - 1) * limit;
  return {
    page,
    limit,
    skip,
    sortBy,
    sortOrder,
  };
};

export const paginationHelpers = {
  calculatePagination,
};
