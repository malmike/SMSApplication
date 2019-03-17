import * as express from 'express';
import * as path from 'path';
import * as bodyParser from 'body-parser';

import * as userAuthentication from './routes/authentication/user_authentication.router';

/**
 * Setup express server
 */
const app = express();
const port = process.env.PORT || 1337;

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/authentication', userAuthentication.getUser());
app.use('/authentication', userAuthentication.userSignUp());

app.get( '/', function ( req, res )
{
  res.send( 'Welcome to my API' );
})


app.listen( port, function ()
{
  console.log( 'Running on port: ' + port );
});
