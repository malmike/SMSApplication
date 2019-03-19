import * as express from 'express';
import UserModel from '../../models/user.model';

export default class UserAuthentication{
  router: express.Router;
  constructor(){
    this.router = express.Router();
  }

  userSignUp(): express.Router{
    this.router.post('/registerUser', (req, res) => {
      const user = new UserModel(req.body);
      user.save();
      return res.status(201).send(JSON.stringify(user))
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
    this.router.get('/getUser', (req, res) => {
      UserModel.find((err, values)=> {
        if(err) res.status(500).send(err)
        else res.json(values);
      })
    })
    return this.router;
  }
}