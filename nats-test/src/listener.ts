import nats, { Message, Stan } from 'node-nats-streaming';
import { randomBytes } from 'crypto';
import { TicketCreatedListener } from './events/ticket-created-listener';

console.clear();

const sc = nats.connect('ticketing', randomBytes(4).toString('hex'), {
  url: 'http://localhost:4222',
});

sc.on('connect', () => {
  console.log('Listener connected to NATS');

  // Listen to 'close' message to tell NATS to not send messages
  // on this listener
  sc.on('close', () => {
    console.log('NATS connection closed!');
    process.exit(); // Kick out the execution of this node program
  });

  new TicketCreatedListener(sc).listen();
});

// Listen when the ts-node-dev tool, sends the following signals
// in order to emit the 'close' message and terminate this listener client
// but also tell the server to not send us any more messages
process.on('SIGINT', () => sc.close()); // Interrupt signal
process.on('SIGTERM', () => sc.close()); // Terminal signal
