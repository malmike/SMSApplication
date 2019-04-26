import * as express from 'express';
import {UserModel, Contact, ContactModel} from '../../models/user.model';
import UserAuthentication from '../../middleWare/user_authentication.middleware';
import { Response } from 'express';
import { IRequest } from '../../express';
import { SmsModel } from '../../models/sms.model';

export default class ContactRoutes{
  private router: express.Router;
  private userAuthentication: UserAuthentication;

  constructor(){
    this.router = express.Router();
    this.userAuthentication = new UserAuthentication();
  }

  /**
   * @swagger
   * /addContact:
   *   post:
   *    tags:
   *      - "Contact"
   *    description: "Add contact"
   *    consumes:
   *      - "application/json"
   *    produces:
   *       - "application/json"
   *    parameters:
   *    - in: "body"
   *      name: "body"
   *      description: "Add contact"
   *      required: true
   *      schema:
   *        $ref: "#/definitions/AddContact"
   *    responses:
   *      201:
   *        description: "successfully added contact"
   *        schema:
   *          $ref: "#/definitions/Contact"
   *      500:
   *        description: "server error"
   *      401:
   *        description: "Invalid token"
   *        schema:
   *          $ref: "#/definitions/ResponseMessage"
   *      400:
   *        description: "Bad request"
   *        schema:
   *          $ref: "#/definitions/ResponseMessage"
   *    security:
   *    - api_key: []
   */
  addContact(): express.Router{
    this.router.use(this.userAuthentication.userAuth);
    this.router.post('/addContact', async (req:IRequest, res:Response) => {
      const contactData = req.body as Contact;
      UserModel.findOne({
        phone_number: contactData.contact_phone_number
      }, async (err, user) => {
        if(err){
          res.status(500).send(err);
        }
        if(!user){
          const message = 'No user exists with this phone number';
          res.status(400).send({message});
        }else{
          const existingConnection = user.contacts.find(contact => contact.contact_phone_number === req.user.phone_number);
          if(existingConnection){
            contactData.message_thread = existingConnection.message_thread;
          }else{
            contactData.message_thread = Math.random().toString(36).substr(2, 9);
          }
          const contactExists = req.user.contacts.find(contact =>  contact.contact_phone_number === user.phone_number);
          if(!contactExists){
            const contact = new ContactModel(contactData);
            req.user.contacts.push(contact);
            await req.user.save(err=> {
              if(err){
                res.status(500).send(err);
              }else{
                res.status(201).send(contact);
              }
            })
          }else{
            const message = "Contact already exist for this user";
            res.status(400).send({message});
          }
        }
      })
    })
    return this.router;
  }

  /**
   *  @swagger
   *  /getContacts:
   *    get:
   *      tags:
   *        - "Contact"
   *      description: "Get Contacts"
   *      produces:
   *        - "application/json"
   *      responses:
   *        200:
   *          description: "Contacts successfully retrieved"
   *          schema:
   *            type: "array"
   *            items:
   *              $ref: '#/definitions/Contact'
   *        401:
   *          description: "Invalid token"
   *          schema:
   *            $ref: "#/definitions/ResponseMessage"
   *        500:
   *          description: "server error"
   *      security:
   *      - api_key: []
   */
  getContacts(): express.Router{
    this.router.use(this.userAuthentication.userAuth);
    this.router.get('/getContacts', async (req:IRequest, res:Response) => {
      res.status(200).send(req.user.contacts);
    })
    return this.router;
  }

  /**
   * @swagger
   * /deleteContact/{phone_number}:
   *   delete:
   *     tags:
   *       - "Contact"
   *     description: "Get Contacts"
   *     produces:
   *       - "application/json"
   *     parameters:
   *     - name: "phone_number"
   *       in: "path"
   *       description: "Phone number of contact to be deleted"
   *       required: true
   *       type: "string"
   *     responses:
   *       204:
   *         description: "Deletion successful"
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

  deleteContact(): express.Router{
    this.router.use(this.userAuthentication.userAuth);
    this.router.delete('/deleteContact/:phone_number', async (req:IRequest, res:Response) => {
      const contact = req.user.contacts.find(contact => contact.contact_phone_number === req.params.phone_number);
      if(!contact){
        const message = `The number ${req.params.phone_number} does not exist in your contacts`;
        return res.status(400).send({message});
      }
      return UserModel.findByIdAndUpdate(req.user._id, {
        $pull:{
          contacts: { contact_phone_number: req.params.phone_number }
        }
      }, async (err) => {
        if(err){
          return res.status(500).send(err);
        }
        return await SmsModel.deleteMany({
          message_thread: contact.message_thread
        }, (err) => {
          if(err){
            res.status(500).send(err);
          }
          return res.status(204).send();
        })
      })
    })
    return this.router;
  }
}