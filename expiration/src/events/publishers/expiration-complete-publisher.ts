import {
  Subjects,
  Publisher,
  ExpirationCompleteEvent,
} from '@ekohtickets/common';

export class ExpirationCompletePublisher extends Publisher<ExpirationCompleteEvent> {
  readonly subject = Subjects.ExpirationComplete;
}
