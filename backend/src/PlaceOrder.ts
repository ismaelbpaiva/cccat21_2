import OrderDAO from "./OrderDAO";
import * as crypto from "crypto";


export default class PlaceOrder {
  constructor(readonly orderDAO: OrderDAO) {}

  async execute(input: any) {
    const order = {
      orderId: crypto.randomUUID(),
      marketId: input.marketId,
      accountId: input.accountId,
      side: input.side,
      quantity: input.quantity,
      price: input.price,
      status: "open",
      timestamp: new Date(),
    };
    await this.orderDAO.saveOrder(order);
    return {
      orderId: order.orderId,
    };
  }
}
