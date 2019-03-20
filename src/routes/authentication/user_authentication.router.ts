import * as express from 'express';
import {UserModel, User} from '../../models/user.model';

export default class UserAuthentication{
  router: express.Router;
  constructor(){
    this.router = express.Router();
  }

  userSignUp(): express.Router{
    this.router.post('/registerUser', async (req, res) => {
      const user: User = new UserModel(req.body as User);
      await user.save();
      res.status(201);
      res.send(user);
    })
    return this.router;
  }

  /**
   * @swagger
   * /getUser:
   *   get:
   *     tags:
   *       - users
   *     description: Gets all users
   *     produces:
   *       - application/json
   *     responses:
   *       200:
   *         description: Successfully deleted
   *         schema:
   *           $ref: '#/definitions/users'
   */
  getUser(): express.Router{
    this.router.get('/getUser', async (req, res) => {
      await UserModel.find((err, values)=> {
        if(err) res.status(500).send(err)
        else res.json(values);
      })
    })
    return this.router;
  }
}