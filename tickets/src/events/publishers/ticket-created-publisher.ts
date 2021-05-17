import { Publisher, Subjects, TicketCreatedEvent } from '@ekohtickets/common';

export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent> {
  readonly subject = Subjects.TicketCreated;
}
