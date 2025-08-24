import {
  EXCHANGE_EVENTS,
  OrderVerifyRequest,
  OrderVerifyResult,
} from "@/events/rabbitmq.events";
import { RabbitMQService } from "../rabbitmq/rabbitmq.service";
import { IOrder } from "./order.interface";
import { OrderModel } from "./order.model";
import ApiError from "@/middlewares/error";
import { HttpStatusCode } from "@/lib/httpStatus";

class Service {
  async placeAnOrder(data: IOrder) {
    const correlationId = `${Date.now()}-${Math.random().toString(16).slice(2)}`;
    const payload: OrderVerifyRequest = {
      type: "order.verify",
      payload: { items: data.items },
      correlationId,
    };

    // Publish the order verification request
    RabbitMQService.publish("order.verify", payload);

    const verified: OrderVerifyResult =
      await RabbitMQService.verifyOrderProductAvailability<OrderVerifyResult>(
        EXCHANGE_EVENTS,
        "order.verify.result",
        correlationId
      );

    if (!verified?.ok) {
      throw new ApiError(
        HttpStatusCode.BAD_REQUEST,
        verified?.reason || "Failed to verify order"
      );
    }

    const total = data.items.reduce((sum, it) => sum + it.price * it.qty, 0);
    const order = await OrderModel.create({ ...data, total });

    // fire event to decrement stock
    RabbitMQService.publish("order.stock.decrement", {
      orderId: order.id,
      items: data.items,
    });

    return order;
  }
}

export const OrderService = new Service();
