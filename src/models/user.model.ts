import * as mongoose from 'mongoose';

const Schema = mongoose.Schema;

/**
 * @swagger
 * definition:
 *   users:
 *     properties:
 *       name:
 *         type: string
 *       phone_number:
 *         type: string
 */

export interface User extends mongoose.Document{
  name: string;
  phone_number: string
}

const userSchema = new Schema(
  {
    name: {
      type: String
    },
    phone_number: {
      type: String
    }
  }
)

export const UserModel = mongoose.model<User>('User', userSchema);
