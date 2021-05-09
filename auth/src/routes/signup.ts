import express, { Request, Response } from 'express'; // Import Request and Response types for ts
import { body } from 'express-validator';
// body is a function that takes the req.body object and we use it to validate the info within
// validationResult is a function that outpus errors if any occured
import jwt from 'jsonwebtoken';

import { User } from '../models/user';

import {
  validateRequest,
  BadRequestError,
} from '@ekohtickets/common';

const router = express.Router();

router.post('/api/users/hello', (req: Request, res: Response) => {
  res.status(200).send('hello');
});

router.post(
  '/api/users/signup',
  [
    body('email') // Validate the property 'email' within the req.body object
      .isEmail()
      .withMessage('Email must be valid'),
    body('password')
      .trim()
      .isLength({ min: 4, max: 20 })
      .withMessage('Password must be between 4 and 20 characters'),
  ],
  validateRequest, // Validate Request middleware
  async (req: Request, res: Response) => {
    const { email, password } = req.body;
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      // console.log('Email in use');
      // return res.send({});
      throw new BadRequestError('Email in use');
    }

    const user = User.build({ email, password });
    await user.save();

    // Generate JWT
    const userJwt = jwt.sign(
      {
        id: user.id,
        email: user.email,
      },
      process.env.JWT_KEY!, // ! is used to tell typescript nothing is wrong
    );

    // Store it on the session object
    req.session = {
      jwt: userJwt,
    };

    res.status(201).send(user);
  },
);

export { router as signupRouter };
