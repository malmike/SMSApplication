import * as express from 'express';
import { Sms, SmsModel } from '../../models/sms.model';
import UserAuthentication from '../../middleWare/user_authentication.middleware';
import { Response } from 'express';
import { IRequest } from '../../express';

export default class SmsRoutes{
  private router: express.Router;
  private userAuthentication: UserAuthentication;

  constructor(){
    this.router = express.Router();
    this.userAuthentication = new UserAuthentication();
  }

  /**
   * @swagger
   * /sendSms:
   *   post:
   *     tags:
   *       - "Sms"
   *     description: "Send sms"
   *     consumes:
   *       - "application/json"
   *     produces:
   *        - "application/json"
   *     parameters:
   *     - in: "body"
   *       name: "body"
   *       description: "Send sms"
   *       required: true
   *       schema:
   *         $ref: "#/definitions/SendSms"
   *     responses:
   *       201:
   *         description: "successfully sent sms"
   *         schema:
   *           $ref: "#/definitions/Sms"
   *       500:
   *         description: "server error"
   *       401:
   *         description: "Invalid token"
   *         schema:
   *           $ref: "#/definitions/ResponseMessage"
   *       400:
   *         description: "Bad request"
   *         schema:
   *           $ref: "#/definitions/ResponseMessage"
   *     security:
   *     - api_key: []
   */
  sendSms(): express.Router{
    this.router.use(this.userAuthentication.userAuth);
    this.router.post('/sendSms', async (req:IRequest, res:Response) => {
      const smsData = req.body as Sms;
      const receiverContact = req.user.contacts.find(contact => contact.contact_phone_number === smsData.receiver_phone_number);
      if(!receiverContact){
        const message =  `The number ${smsData.receiver_phone_number} does not exist in your contacts`;
        res.status(400).send({message});
      }else{
        smsData.sender_phone_number = req.user.phone_number;
        smsData.message_thread = receiverContact.message_thread;
        const sms = new SmsModel(smsData);
        await sms.save(err => {
          if(err){
            res.status(500).send(err);
           }else{
             res.status(201).send(sms);
           }
        })
      }
    })
    return this.router;
  }

  /**
   * @swagger
   * /getSms/{phone_number}:
   *   get:
   *     tags:
   *       - "Sms"
   *     description: "Get Sms"
   *     produces:
   *       - "application/json"
   *     parameters:
   *     - name: "phone_number"
   *       in: "path"
   *       description: "Phone number of contact whose sms thread should be retrieved"
   *       required: true
   *       type: "string"
   *     responses:
   *       200:
   *         description: "Retrieving of SMSs successfull"
   *         schema:
   *           type: "array"
   *           items:
   *             $ref: "#/definitions/Sms"
   *       400:
   *         description: "Bad request"
   *         schema:
   *           $ref: "#/definitions/ResponseMessage"
   *       401:
   *         description: "Invalid token"
   *         schema:
   *           $ref: "#/definitions/ResponseMessage"
   *       500:
   *         description: "server error"
   *     security:
   *     - api_key: []
   */
  getSmsThread(): express.Router{
    this.router.use(this.userAuthentication.userAuth);
    this.router.get('/getSms/:phone_number', async (req:IRequest, res:Response) => {
      const receiverContact = req.user.contacts.find(contact => contact.contact_phone_number === req.params.phone_number);
      if(!receiverContact){
        const message = `The number ${req.params.phone_number} does not exist in your contacts`;
        res.status(400).send({message});
      } else {
        SmsModel.find({
          message_thread: receiverContact.message_thread
        }, (err, messages) => {
          if(err){
            res.status(500).send(err)
          }else {
            res.status(200).send(messages)
          }
        })
      }
    })
    return this.router;
  }

  /**
   * @swagger
   * /updateStatus:
   *   put:
   *     tags:
   *       - "Sms"
   *     description: "Update read status for sms thread"
   *     consumes:
   *       - "application/json"
   *     produces:
   *        - "application/json"
   *     parameters:
   *     - in: "body"
   *       name: "body"
   *       description: "Update Sms Status"
   *       required: true
   *       schema:
   *         $ref: "#/definitions/UpdateSmsStatus"
   *     responses:
   *       201:
   *         description: "successfully sent sms"
   *         schema:
   *           $ref: "#/definitions/ResponseMessage"
   *       500:
   *         description: "server error"
   *       401:
   *         description: "Invalid token"
   *         schema:
   *           $ref: "#/definitions/ResponseMessage"
   *     security:
   *     - api_key: []
   */
  updateReadStatus(): express.Router{
    this.router.use(this.userAuthentication.userAuth);
    this.router.put('/updateStatus', async (req:IRequest, res:Response) => {
      const message_thread = req.body.message_thread;
      return await SmsModel.updateMany({
        receiver_phone_number: req.user.phone_number,
        message_thread: message_thread,
        readStatus: false
      }, {$set: {readStatus: true}}, (err, resp) => {
        if(err){
          return res.status(500).send(err);
        }
        const message = resp["nModified"] > 0 ?
          `SMS status updated successfully`:
          `No SMS whose status needs updating exists`;
        return res.status(201).send({message});
      })
    });
    return this.router;
  }
}