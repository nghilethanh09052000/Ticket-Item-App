import express, { Request, Response } from "express";
import { requireAuth, ValidateRequest } from "@nghilt/common";
import { body } from "express-validator";
import { Ticket } from "../models/ticket";
import { TicketCreatedPublisher } from "../events/publisher/ticker-created-publisher";


const router = express.Router();

router.post(
  "/api/tickets",
  requireAuth,
  [
    body("title").not().isEmpty().withMessage("Title is required"),
    body("price")
      .isFloat({ gt: 0 })
      .withMessage("Price must be greater than 0"),
  ],
  ValidateRequest,
  async (req: Request, res: Response) => {

    const {title,price} = req.body;
    const ticket = Ticket.build({
      title,
      price,
      userId:req.currentUser!.id
    })
    await ticket.save();

    await new TicketCreatedPublisher(client).publish({
      id:ticket.id,
      title:ticket.title,
      price:ticket.price,
      userId:ticket.userId
    })
    res.status(201).send(ticket)
  }
);

export { router as createTicketRouter };
