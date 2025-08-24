import { ConsumeMessage } from "amqplib";
import { ProductService } from "./product.service";
import { RabbitMQService } from "../rabbitmq/rabbitmq.service";
import {
  QUEUE_STOCK_DECREMENT,
  QUEUE_VERIFY_REQUESTS,
} from "@/events/rabbitmq.events";

class Service {
  async init() {
    await this.initStockListener();
    await this.initVerifyListener();
  }

  private async initStockListener() {
    await RabbitMQService.bindQueue(
      QUEUE_STOCK_DECREMENT,
      "order.stock.decrement"
    );
    RabbitMQService.consume(
      QUEUE_STOCK_DECREMENT,
      this.onStockDecrement.bind(this)
    );

    console.log(
      `Listening for "order.stock.decrement" on queue "${QUEUE_STOCK_DECREMENT}"`
    );
  }

  private async onStockDecrement(msg: ConsumeMessage) {
    const data = JSON.parse(msg.content.toString()) as {
      orderId: string;
      items: Array<{ productId: string; qty: number }>;
    };

    console.log(`Received stock decrement for order ${data.orderId}`);

    try {
      await ProductService.decrementStock(data.items);
      console.log(`Stock decremented for order ${data.orderId}`);
    } catch (err) {
      console.error("Failed to decrement stock:", err);
    }
  }

  private async initVerifyListener() {
    await RabbitMQService.bindQueue(QUEUE_VERIFY_REQUESTS, "order.verify");
    RabbitMQService.consume(
      QUEUE_VERIFY_REQUESTS,
      this.onOrderVerify.bind(this)
    );

    console.log(
      `Listening for "order.verify" requests on queue "${QUEUE_VERIFY_REQUESTS}"`
    );
  }

  private async onOrderVerify(msg: ConsumeMessage) {
    const req = JSON.parse(msg.content.toString()) as {
      type: "order.verify";
      payload: { items: Array<{ productId: string; qty: number }> };
      correlationId: string;
    };

    console.log("Received order.verify:", req);

    const result = await ProductService.verifyAvailability(req.payload.items);

    await this.sendResult(
      req.correlationId,
      result.ok,
      result.reason,
      result.items
    );
  }

  private async sendResult(
    correlationId: string,
    ok: boolean,
    reason?: string,
    items?: Array<{ productId: string; price: number; qty: number }>
  ) {
    RabbitMQService.publish("order.verify.result", {
      correlationId,
      payload: { ok, reason, items },
    });

    console.log(`Sent order.verify.result for correlationId ${correlationId}`);
  }
}

export const ProductMQService = new Service();
