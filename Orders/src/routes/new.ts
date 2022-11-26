import express, { Request, Response } from 'express';
import { BadRequestError, NotFoundError, OrderStatus, requireAuth, ValidateRequest } from '@nghilt/common';
import { body } from 'express-validator';
import mongoose from 'mongoose';
import { Ticket } from '../models/ticket';
import { Order } from '../models/order';
import { OrderCreatedPublisher } from '../event/publisher/order-created-publisher';
import { natsWrapper } from '../nats-wrapper';


const router = express.Router();
const EXPIRATION_WINDOW_SECONDS = 15 * 60

router.post(
  '/api/orders',
  requireAuth, [
  body('ticketId')
    .not()
    .isEmpty()
    .custom((input: string) => mongoose.Types.ObjectId.isValid(input))
    .withMessage('TicketId must be provided')
],
  ValidateRequest,
  async (req: Request, res: Response) => {

    const { ticketId } = req.body;

    // Find the ticket user is trying to order in the database
    const ticket = await Ticket.findById(ticketId);
    if (!ticket) {
      throw new NotFoundError();
    }

    /**
           MAKE SURE THE TICKET HAS ALREADY BEEN RESERVED:
      + Run query to look all orders
      + Find an order where the ticket is the ticket we just found
      + If found, just make sure the order status is not Cancelled
      + If we find the order, so the ticket has been reserved
    **/
    const isReserved = await ticket.isReserved();
    if (isReserved) {
      throw new BadRequestError('Ticket is already reserved');
    }

    // Calculate an expiration date for this order
    const expiration = new Date();
    expiration.setSeconds(expiration.getSeconds() + EXPIRATION_WINDOW_SECONDS);

    // Build the order and save it to the database
    const order = Order.build({
      userId: req.currentUser!.id,
      status: OrderStatus.Created,
      expiresAt: expiration,
      ticket
    })
    await order.save();
 

    // Publish an event and saying that an order is created
    new OrderCreatedPublisher(natsWrapper.client).publish({
      id: order.id,
      status: order.status,
      userId: order.userId,
      expiresAt: order.expiresAt.toISOString(),
      ticket: {
        id: ticket.id,
        price: ticket.price
      }
    })


    res.status(201).send(order);
  });

export { router as newOrderRouter };
