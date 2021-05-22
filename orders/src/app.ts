import express from 'express';
import 'express-async-errors';
import { json } from 'body-parser';
import cookieSession from 'cookie-session';
import { NotFoundError, errorHandler, currentUser } from '@ekohtickets/common';

import { deleteOrderRouter } from './routes/delete';
import { createOrderRouter } from './routes/new';
import { showOrderRouter } from './routes/show';
import { indexOrderRouter } from './routes/index';

const app = express();
app.set('trust proxy', true); // To let know express that is being proxied by nginx
app.use(json());
app.use(
  cookieSession({
    signed: false, // Disable the encription
    secure: process.env.NODE_ENV !== 'test', // Only send cookies to https connections
  }),
);

app.use(currentUser);

app.use(deleteOrderRouter);
app.use(createOrderRouter);
app.use(showOrderRouter);
app.use(indexOrderRouter);

app.all('*', async (req, res, next) => {
  throw new NotFoundError();
});

app.use(errorHandler);

export { app };
