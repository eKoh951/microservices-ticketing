import { Publisher, Subjects, TicketUpdatedEvent } from '@ekohtickets/common';

export class TicketUpdatedPublisher extends Publisher<TicketUpdatedEvent> {
  readonly subject = Subjects.TicketUpdated;
}
