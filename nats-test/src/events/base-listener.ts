import { Message, Stan } from 'node-nats-streaming';
import { Subjects } from './subjects';

interface Event {
  subject: Subjects;
  data: any;
}

export abstract class Listener<T extends Event> {
  abstract subject: T['subject']; // We specify that the subject has to be of type Subjects
  abstract queueGroupName: string;
  abstract onMessage(data: T['data'], msg: Message): void;
  private client: Stan;
  protected ackWait = 5 * 1000;

  constructor(client: Stan) {
    this.client = client;
  }

  subscriptionOptions() {
    // To not acknowledge the event process automatically
    // so we can put some rules to follow to acknowledge the message
    return this.client
      .subscriptionOptions()
      .setDeliverAllAvailable() // To re-deliver all the messages that has been sent in the past
      .setManualAckMode(true) // To re-deliver all the messages that has been sent in the past
      .setAckWait(this.ackWait) // This sets the amount of time in ms to wait
      .setDurableName(this.queueGroupName); // Set a Durable Subscription to only process the missing messages
  }

  listen() {
    const subscription = this.client.subscribe(
      this.subject,
      this.queueGroupName, // It is necessary to have the queue group name in order for the Durable Subscription to work
      this.subscriptionOptions(),
    );

    // Instead of listening to 'events' we listen to 'mesages'
    subscription.on('message', (msg: Message) => {
      console.log(
        `Message received: ${this.subject} / ${this.queueGroupName}`,
      );

      const parsedData = this.parseMessage(msg);
      this.onMessage(parsedData, msg);
    });
  }

  parseMessage(msg: Message) {
    const data = msg.getData();

    return typeof data === 'string'
      ? JSON.parse(data)
      : JSON.parse(data.toString('utf8'));
  }
}
