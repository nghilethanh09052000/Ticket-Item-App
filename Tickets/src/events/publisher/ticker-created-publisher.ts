import {Publisher, Subjects, TicketCreatedEvent} from '@nghilt/common';

export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent> {
    subject: Subjects.TicketCreated = Subjects.TicketCreated;

}



