import { IProduct } from "./product.interface";
import { ProductModel } from "./product.model";

class Service {
  async create(data: IProduct) {
    const product = await ProductModel.create(data);
    return product;
  }
  async createMany(data: IProduct[]) {
    const products = await ProductModel.create(data);
    return products;
  }

  async verifyAvailability(
    items: Array<{ productId: string; qty: number }>
  ): Promise<{
    ok: boolean;
    reason?: string;
    items?: Array<{ productId: string; price: number; qty: number }>;
  }> {
    const productIds = items.map((i) => i.productId);
    const products = await ProductModel.find({ _id: { $in: productIds } });

    if (products.length !== productIds.length) {
      return { ok: false, reason: "Some products do not exist" };
    }

    for (const item of items) {
      const product = products.find((p) => p._id.toString() === item.productId);
      if (!product) return { ok: false, reason: "Product not found" };
      if (product.quantity < item.qty)
        return {
          ok: false,
          reason: `Insufficient quantity for ${product.name}`,
        };
    }

    const verifiedItems = items.map((item) => {
      const product = products.find(
        (p) => p._id.toString() === item.productId
      )!;
      return {
        productId: product._id.toString(),
        price: product.price,
        qty: item.qty,
      };
    });

    return { ok: true, items: verifiedItems };
  }

  async decrementStock(
    items: Array<{ productId: string; qty: number }>
  ): Promise<void> {
    const bulkOps = items.map((item) => ({
      updateOne: {
        filter: { _id: item.productId, quantity: { $gte: item.qty } },
        update: { $inc: { quantity: -item.qty, total_sold: +item.qty } },
      },
    }));

    const result = await ProductModel.bulkWrite(bulkOps);

    const modifiedCount = result.modifiedCount || 0;
    if (modifiedCount !== items.length) {
      console.warn("Some items were not decremented due to insufficient stock");
    }
  }
}

export const ProductService = new Service();
