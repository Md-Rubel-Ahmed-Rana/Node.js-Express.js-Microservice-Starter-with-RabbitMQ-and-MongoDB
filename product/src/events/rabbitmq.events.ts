export type RoutingKey =
  | "user.created"
  | "order.verify"
  | "order.verify.result"
  | "order.stock.decrement";

export type UserCreatedEvent = {
  type: "user.created";
  payload: { id: string; email: string };
};

export type OrderVerifyRequest = {
  type: "order.verify";
  payload: { items: Array<{ productId: string; qty: number }> };
  correlationId: string;
};

export type OrderVerifyResult = {
  type: "order.verify.result";
  payload: {
    ok: boolean;
    reason?: string;
    items?: Array<{ productId: string; price: number; qty: number }>;
  };
  correlationId: string;
};

export type OrderStockDecrementEvent = {
  type: "order.stock.decrement";
  payload: {
    orderId: string;
    items: Array<{ productId: string; qty: number }>;
  };
};

export type EventMap =
  | UserCreatedEvent
  | OrderVerifyRequest
  | OrderVerifyResult
  | OrderStockDecrementEvent;

export const EXCHANGE_EVENTS = "events.topic";
export const QUEUE_VERIFY_REQUESTS = "order.verify.q";
export const QUEUE_VERIFY_RESULTS = "order.verify.result.q";
export const QUEUE_STOCK_DECREMENT = "order.stock.decrement.q";
