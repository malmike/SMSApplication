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
const user = new Schema(
  {
    name: {
      type: String
    },
    phone_number: {
      type: String
    }
  }
)

const UserModel = mongoose.model('User', user);

export default UserModel;
