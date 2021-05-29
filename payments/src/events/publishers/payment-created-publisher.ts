import { Subjects, Publisher, PaymentCreatedEvent } from '@ekohtickets/common';

export class PaymentCreatedPublisher extends Publisher<PaymentCreatedEvent> {
  readonly subject = Subjects.PaymentCreated;
}
