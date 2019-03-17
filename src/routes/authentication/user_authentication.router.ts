import * as express from 'express';

let user = [];

export function userSignUp(): express.Router{
  var router = express.Router();
  router.post('/registerUser', (req, res) => {
    user.push(req.body);
    console.log(`User: ${user}`);
    return res.status(201).send(JSON.stringify(user))
  })
  return router;
}

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

/**
 * @swagger
 * /authentication/getUser:
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
export function getUser(): express.Router{
  var router = express.Router();
  router.get('/getUser', (req, res) => {
    res.json({user: user})
    res.status(200);
  })
  debugger;
  return router;
}
