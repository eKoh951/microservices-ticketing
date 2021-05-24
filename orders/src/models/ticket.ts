import mongoose from 'mongoose';
import { updateIfCurrentPlugin } from 'mongoose-update-if-current';
import { Order, OrderStatus } from './order';

interface TicketAttrs {
  id: string;
  title: string;
  price: number;
}

export interface TicketDoc extends mongoose.Document {
  title: string;
  price: number;
  version: number;
  isReserved(): Promise<boolean>;
}

interface TicketModel extends mongoose.Model<TicketDoc> {
  build(attrs: TicketAttrs): TicketDoc;
  findByEvent(event: {
    id: string;
    version: number;
  }): Promise<TicketDoc | null>;
}

const ticketSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
  },
  {
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
      },
    },
  },
);

ticketSchema.set('versionKey', 'version');
ticketSchema.plugin(updateIfCurrentPlugin);

// statics is to add a new method to the Model
ticketSchema.statics.build = ({ id, title, price }: TicketAttrs) => {
  return new Ticket({
    _id: id,
    title,
    price,
  });
};

ticketSchema.statics.findByEvent = (event: { id: string; version: number }) => {
  return Ticket.findOne({
    _id: event.id,
    version: event.version - 1,
  });
};

// methods is to add a new method but to the Document
ticketSchema.methods.isReserved = async function () {
  // this === the ticket Document that we just called 'isReserved' on
  const existingOrder = await Order.findOne({
    ticket: this,
    status: {
      $in: [
        // MongoDB operator
        // selects the documents where the value of a field equals any
        // value in the specified array
        // https://docs.mongodb.com/manual/reference/operator/query/in/
        OrderStatus.Created,
        OrderStatus.AwaitingPayment,
        OrderStatus.Complete,
      ],
    },
  });

  return !!existingOrder;
};

const Ticket = mongoose.model<TicketDoc, TicketModel>('Ticket', ticketSchema);

export { Ticket };
