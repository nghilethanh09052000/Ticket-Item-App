import {Publisher, Subjects, TicketUpdatedEvent} from '@nghilt/common';

export class TicketUpdatedPublisher extends Publisher<TicketUpdatedEvent> {
    subject: Subjects.TicketUpdated = Subjects.TicketUpdated;
}

