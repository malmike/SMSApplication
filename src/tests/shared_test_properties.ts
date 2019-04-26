import * as jwt from 'jsonwebtoken';
import { UserModel, ContactModel } from '../models/user.model';
import config from '../app_configurations/config';
import { SmsModel } from '../models/sms.model';


export class SharedTestProperties{
  static testUser = {name: 'Mal Mike', phone_number: '0784435088', contacts: []};
  static testContact = {name: 'Test Contact', phone_number: '0794243073', contacts: []};
  static testContactToken: string = '';

  constructor(){}

  static async addTestUser(): Promise<string>{
    const user = new UserModel(this.testUser);
    await user.save();
    return jwt.sign({_id: user._id, phone_number: user.phone_number}, config.APP_SECRET)
  }

  static async addTestUserWithContact(): Promise<string>{
    this.addTestContact();
    const contact =  new ContactModel({
      contact_phone_number: '0794243073',
      contact_name: 'test contact',
      message_thread: 'thisshouldwork'
    })
    this.testUser.contacts = [
      contact
    ];
    const user = new UserModel(this.testUser);
    await user.save();
    return jwt.sign({_id: user._id, phone_number: user.phone_number}, config.APP_SECRET)
  }

  static async addTestContact(){
    const user = new UserModel(this.testContact);
    await user.save();
    this.testContactToken = jwt.sign({_id: user._id, phone_number: user.phone_number}, config.APP_SECRET)
  }

  static async addTestExistingConnection(){
    this.testContact.contacts = [
      {
        contact_phone_number: '0784435088',
        contact_name: 'malmike',
        message_thread: 'thisshouldwork'
      }
    ];
    const existingConnection = new UserModel(this.testContact);
    await existingConnection.save();
  }

  static async addTestUserWithSms(){
    const token = await this.addTestUserWithContact();
    const sms = new SmsModel({
      receiver_phone_number: '0794243073',
      message: 'This message should go through',
      sender_phone_number: '0784435088',
      message_thread: 'thisshouldwork',
      readStatus: false,
    })
    await sms.save();
    return token;
  }
}