import { Publisher, OrderCancelledEvent, Subjects } from "@nghilt/common";


export class OrderCancelledPublisher extends Publisher<OrderCancelledEvent> {
    subject: Subjects.OrderCancelled  = Subjects.OrderCancelled;
}

