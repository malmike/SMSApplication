import {Request} from 'express';
import { User } from './models/user.model';

interface IRequest extends Request {
  user?: User;
  phone_number?: string;
}