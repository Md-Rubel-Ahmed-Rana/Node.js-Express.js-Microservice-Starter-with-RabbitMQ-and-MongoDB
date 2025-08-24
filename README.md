# Nodejs/Express Microservices - User, Product & Order Microservice Architecture

This repository contains the **Product** and **Order** microservices for an E-Commerce application, implemented using **Node.js**, **TypeScript**, **MongoDB**, and **RabbitMQ**. The system follows an **event-driven architecture** to manage product availability, orders

---

## **Microservices Overview**

### 1. **Product Microservice**

Responsible for:

- Managing product data (CRUD)
- Verifying product availability
- Decrementing product stock on order creation

**Database Operations**:

- `create` / `createMany` → Add new products to the DB.
- `verifyAvailability` → Checks stock for given items.
- `decrementStock` → Reduce stock quantities after order is placed.

**RabbitMQ Events**:

- **Consumes**:
  - `order.verify` → Verify product availability for an order.
  - `order.stock.decrement` → Decrement stock when an order is created.
- **Publishes**:
  - `order.verify.result` → Sends verification results back to Order Microservice.

**Flow Example**:

1. Order Microservice publishes `order.verify`.
2. Product Microservice verifies stock and replies with `order.verify.result`.
3. Order Microservice creates order if verification is successful.
4. Order Microservice publishes `order.stock.decrement`.
5. Product Microservice decrements stock accordingly.

---

### 2. **Order Microservice**

Responsible for:

- Handling orders
- Managing order verification workflow

**RabbitMQ Events**:

- **Consumes**:
  - `order.verify.result` → Receive product verification result from Product Microservice.
- **Publishes**:
  - `order.verify` → Request product verification before order creation.
  - `order.stock.decrement` → Request stock decrement after order creation.

**Flow Example**:

3. When placing an order:
   - Publish `order.verify`.
   - Wait for `order.verify.result`.
   - If verification succeeds, create order in DB.
   - Publish `order.stock.decrement` to update product stock.

---

## **Event Flow Summary**

| Event                   | Publisher            | Consumer             | Purpose                             |
| ----------------------- | -------------------- | -------------------- | ----------------------------------- |
| `order.verify`          | Order Microservice   | Product Microservice | Check product availability          |
| `order.verify.result`   | Product Microservice | Order Microservice   | Return verification result          |
| `order.stock.decrement` | Order Microservice   | Product Microservice | Decrement product stock after order |
