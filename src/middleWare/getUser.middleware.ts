import * as jwt from 'jsonwebtoken';
import config from '../app_configurations/config';
import {Request, Response, NextFunction} from 'express';
import { UserModel } from '../models/user.model';
import { IRequest } from '../express';

export default class GetUser{

  async getUser(req: IRequest, res: Response, next: NextFunction){
    await UserModel.findOne({
      phone_number: req.phone_number
    }, (err, user) => {
      if(err){
        res.status(500).send(err);
      }
      if(user){
        req.user = user;
        next()
      }else{
        const message=`No user found with the phone number ${req.body.phone_number}`
        res.status(401).send({message});
      }
    })
  }

}