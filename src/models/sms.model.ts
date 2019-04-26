import * as mongoose from 'mongoose';

const Schema = mongoose.Schema;

/**
 *
 * @swagger
 * definition:
 *  SendSms:
 *    type: "object"
 *    required:
 *    - "receiver_phone_number"
 *    - "message"
 *    properties:
 *      receiver_phone_number:
 *        type: "string"
 *      message:
 *        type: "string"
 *
 *  UpdateSmsStatus:
 *    type: "object"
 *    required:
 *    - "message_thread"
 *    properties:
 *      message_thread:
 *        type: "string"
 *
 *  Sms:
 *    type: "object"
 *    properties:
 *      sender_phone_number:
 *        type: "string"
 *      receiver_phone_number:
 *        type: "string"
 *      message_thread:
 *        type: "string"
 *      message:
 *        type: "string"
 *      readStatus:
 *        type: "boolean"
 *
 */
export interface Sms extends mongoose.Document{
  sender_phone_number: String;
  receiver_phone_number: String;
  message_thread: String;
  message: String;
  readStatus: Boolean;
}

const smsSchema = new Schema(
  {
    sender_phone_number:{
      type: String,
      ref: 'user',
    },
    receiver_phone_number: {
      type: String,
      ref: 'user',
    },
    message_thread: {
      type: String,
    },
    message: {
      type: String,
    },
    readStatus:{
      type: Boolean,
      default: false
    }
  }
)

mongoose.set('useCreateIndex', true);
export const SmsModel = mongoose.model<Sms>('sms', smsSchema);