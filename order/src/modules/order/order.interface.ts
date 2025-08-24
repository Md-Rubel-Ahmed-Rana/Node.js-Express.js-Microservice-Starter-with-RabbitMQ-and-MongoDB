export type IOrderItem = {
  productId: string;
  qty: number;
  price: number;
};

export type IOrder = {
  userId: string;
  items: IOrderItem[];
  total: number;
  status: "pending" | "confirmed" | "cancelled";
};
