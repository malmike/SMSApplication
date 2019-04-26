import * as express from 'express';
import * as jwt from 'jsonwebtoken';
import {UserModel, User} from '../../models/user.model';
import config from '../../app_configurations/config';
import UserAuthentication from '../../middleWare/user_authentication.middleware';
import { IRequest } from '../../express';

export default class UserRegistrationRoutes{
  private router: express.Router;

  constructor(){
    this.router = express.Router();
  }

  /**
   * @swagger
   * /registerUser:
   *  post:
   *    tags:
   *      - "User"
   *    description: "Register new user or sign in existing user"
   *    consumes:
   *      - "application/json"
   *    produces:
   *       - "application/json"
   *    parameters:
   *    - in: "body"
   *      name: "body"
   *      description: "Register/ Sign In user"
   *      required: true
   *      schema:
   *        $ref: "#/definitions/UserSignUp"
   *    responses:
   *      200:
   *        description: "successful operation"
   *        schema:
   *          $ref: "#/definitions/SignedInUser"
   *      500:
   *        description: "server error"
   *      400:
   *        description: "Phone number already attached to different account"
   *        schema:
   *          $ref: "#/definitions/ResponseMessage"
   *
   */
  userSignUp(): express.Router{
    this.router.post('/registerUser', async (req, res) => {
      const userData = req.body as User;
      UserModel.findOne({
        phone_number: userData.phone_number
      }, async (err, user) => {
        if(err){
          res.status(500).send(err);
        }
        if(!user){
          const user: User = new UserModel(userData);
          await user.save(err=> {
            if(err){
             res.status(500).send(err);
            }else{
              this.userAutenticationResponse(res, user);
            }
          });
        }else{
          if(user.name !== userData.name){
            const message = `The phone number is already attached to a different user`;
            res.status(400).send({message});
          }else{
            this.userAutenticationResponse(res, user);
          }
        }
      })

    })
    return this.router;
  }

  private userAutenticationResponse(res, user: User){
    const token = jwt.sign({_id: user._id, phone_number: user.phone_number}, config.APP_SECRET)
    const message = {
      user: user,
      token: token
    }
    res.status(201);
    res.send(message);
  }

  /**
   * @swagger
   * /getUser:
   *  get:
   *    tags:
   *      - "User"
   *    description: "Get user"
   *    produces:
   *      - "application/json"
   *    responses:
   *      200:
   *        description: "User successfully retrieved"
   *        schema:
   *          $ref: '#/definitions/User'
   *      401:
   *        description: "Invalid token"
   *        schema:
   *          $ref: "#/definitions/ResponseMessage"
   *      500:
   *        description: "server error"
   *    security:
   *    - api_key: []
   *
   */
  getUser(): express.Router{
    this.router.use(new UserAuthentication().userAuth);
    this.router.get('/getUser', async (req: IRequest, res) => {
      res.status(200).send(req.user);
    })
    return this.router;
  }
}