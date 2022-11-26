import { Publisher, OrderCreatedEvent, Subjects } from "@nghilt/common";


export class OrderCreatedPublisher extends Publisher<OrderCreatedEvent> {
    subject: Subjects.OrderCreated  = Subjects.OrderCreated;

}

