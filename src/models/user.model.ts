import * as mongoose from 'mongoose';

const Schema = mongoose.Schema;

/**
 * @swagger
 * definition:
 *  AddContact:
 *    type: "object"
 *    required:
 *    - "contact_name"
 *    - "contact_phone_number"
 *    properties:
 *      contact_name:
 *        type: "string"
 *      contact_phone_number:
 *        type: "string"
 *
 *  Contact:
 *    type: "object"
 *    properties:
 *      contact_name:
 *        type: "string"
 *      contact_phone_number:
 *        type: "string"
 *      message_thread:
 *        type: "string"
 */
export interface Contact extends mongoose.Document {
  contact_name: String,
  contact_phone_number: String,
  message_thread?: String,
}

const contactSchema = new Schema(
  {
    contact_phone_number: {
      type: String,
      ref: 'user',
    },
    contact_name:{
      type: String
    },
    message_thread:{
      type: String,
      required: false
    }
  }
)


/**
 * @swagger
 * definition:
 *  UserSignUp:
 *    type: "object"
 *    required:
 *    - "name"
 *    - "phone_number"
 *    properties:
 *      name:
 *        type: "string"
 *      phone_number:
 *        type: "string"
 *
 *  SignedInUser:
 *    type: "object"
 *    properties:
 *      user:
 *        $ref: "#/definitions/UserSignUp"
 *      token:
 *        type: "string"
 *
 *  User:
 *    type: "object"
 *    required:
 *    - "name"
 *    - "phone_number"
 *    properties:
 *      name:
 *        type: "string"
 *      phone_number:
 *        type: "string"
 *      contacts:
 *        type: "array"
 *        items:
 *          $ref: "#/definitions/Contact"
 *  ResponseMessage:
 *   type: "object"
 *   properties:
 *     message:
 *       type: "string"
 *
 */
export interface User extends mongoose.Document{
  name: String;
  phone_number: String;
  contacts?: [ Contact ]
}

const userSchema = new Schema(
  {
    name: {
      type: String
    },
    phone_number: {
      type: String,
      unique: true,
    },
    contacts: {
      type: [contactSchema],
      required: false
    }
  }
)

mongoose.set('useCreateIndex', true);
export const ContactModel = mongoose.model<Contact>('contact', contactSchema);
export const UserModel = mongoose.model<User>('user', userSchema);
