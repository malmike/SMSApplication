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

export function getUser(): express.Router{
  var router = express.Router();
  router.get('/getUser', (req, res) => {
    res.json({user: user})
    res.status(200);
  })
  debugger;
  return router;
}
