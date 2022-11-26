import express, { Request, Response } from 'express';
import { requireAuth, NotAuthorizedError, NotFoundError } from '@nghilt/common';
import { Order } from '../models/order';
import { OrderStatus } from '@nghilt/common';
import { OrderCancelledPublisher } from '../event/publisher/order-cancelled-publisher';
import { natsWrapper } from '../nats-wrapper';
const router = express.Router();

router.delete(
  '/api/orders/:orderId',
  async (req: Request, res: Response) => {

    const order = await Order.findById(req.params.orderId).populate('ticket');
    if(!order) {
      throw new NotFoundError();
    }
    if(order.userId !== req.currentUser!.id) {
      throw new NotAuthorizedError();
    }
    order.status = OrderStatus.Cancelled;
    await order.save();
    new OrderCancelledPublisher(natsWrapper.client).publish({
      id: order.id,
      ticket: {
        id: order.ticket.id
      }
    })
    res.status(204).send(order);
  });

export { router as deleteOrderRouter };
