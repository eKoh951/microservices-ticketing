import express from 'express';
import 'express-async-errors';
import { json } from 'body-parser';
import cookieSession from 'cookie-session';

import { currentUserRouter } from './routes/current-user';
import { signinRouter } from './routes/signin';
import { signoutRouter } from './routes/signout';
import { signupRouter } from './routes/signup';
import { errorHandler, NotFoundError } from '@ekohtickets/common';

const app = express();
app.set('trust proxy', true); // To let know express that is being proxied by nginx

app.use(json());
app.use(
  cookieSession({
    signed: false, // Disable the encription
    // secure: process.env.NODE_ENV !== 'test', // Only send cookies to https connections
    secure: false,
  }),
);

app.use(currentUserRouter);
app.use(signinRouter);
app.use(signoutRouter);
app.use(signupRouter);

app.all('*', async (req, res, next) => {
  throw new NotFoundError();
});

app.use(errorHandler);

export { app };
