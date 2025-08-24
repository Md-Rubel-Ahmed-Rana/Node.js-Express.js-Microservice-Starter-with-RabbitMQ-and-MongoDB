import { connect, Channel, ConsumeMessage, Options } from "amqplib";
import { EXCHANGE_EVENTS, RoutingKey } from "@/events/rabbitmq.events";
import { envConfig } from "@/config/index";

class Service {
  private connection!: any;
  private channel!: Channel;
  private readonly url: string = envConfig.rabbitmq.url;

  public async init(): Promise<Channel> {
    if (this.channel) return this.channel;

    const conn: any = await connect(this.url);
    this.connection = conn;
    this.channel = await conn.createChannel();
    await this.channel.assertExchange(EXCHANGE_EVENTS, "topic", {
      durable: true,
    });

    console.log("RabbitMQ connected & channel initialized.");
    return this.channel;
  }

  public publish<T extends object>(
    routingKey: RoutingKey,
    message: T,
    options?: Options.Publish
  ): void {
    if (!this.channel)
      throw new Error("RabbitMQ channel not initialized. Call init() first.");

    const payload = Buffer.from(JSON.stringify(message));
    this.channel.publish(EXCHANGE_EVENTS, routingKey, payload, {
      contentType: "application/json",
      persistent: true,
      ...options,
    });

    console.log(`Message published to ${routingKey}:`, message);
  }

  public async bindQueue(queue: string, routingKey: string): Promise<void> {
    if (!this.channel)
      throw new Error("RabbitMQ channel not initialized. Call init() first.");

    await this.channel.assertQueue(queue, { durable: true });
    await this.channel.bindQueue(queue, EXCHANGE_EVENTS, routingKey);
  }

  public consume(
    queue: string,
    onMessage: (msg: ConsumeMessage) => Promise<void> | void
  ): void {
    if (!this.channel)
      throw new Error("RabbitMQ channel not initialized. Call init() first.");

    this.channel.consume(queue, async (msg) => {
      if (!msg) return;
      try {
        await onMessage(msg);
        this.channel.ack(msg);
      } catch (err) {
        console.error(`Consumer error on queue "${queue}":`, err);
        this.channel.nack(msg, false, true);
      }
    });
  }

  public async close(): Promise<void> {
    if (this.channel) await this.channel.close();
    if (this.connection) await this.connection.close();

    console.log("RabbitMQ connection closed.");
  }
}

export const RabbitMQService = new Service();
