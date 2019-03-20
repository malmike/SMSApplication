import * as express from 'express';
import * as path from 'path';
import * as bodyParser from 'body-parser';

import UserAuthentication from './routes/authentication/user_authentication.router';
import ApiDocumentation from './app_configurations/api_documentation'
import { Utilities } from './utilities/utilities';
import config from './app_configurations/config';



/**
 * Setup express server
 */

export default class ServerSetup{
  app = express();
  private userAuthentication: UserAuthentication;
  private apiDocumentation: ApiDocumentation;

  constructor(){
    this.userAuthentication = new UserAuthentication();
    this.apiDocumentation = new ApiDocumentation();
  }

  serverSetup(){
    const port = config.PORT;

    this.app.use(bodyParser.urlencoded({extended: true}));
    this.app.use(bodyParser.json());
    this.app.use(express.static(path.join(__dirname, 'public')));

    this.app.use(this.apiDocumentation.swaggerDocumentation())
    this.app.use(this.userAuthentication.getUser());
    this.app.use(this.userAuthentication.userSignUp());

    this.app.get( '/', function ( req, res )
    {
      const hostUrl = `${req.protocol}://${Utilities.getHostUrl(req, port)}`
      res.send( `Welcome to the SMS Application API. You can access the API documentation at <a href="${hostUrl}/api-docs/">here</a>` );
    })

    this.app.listen( port, function ()
    {
      console.log( 'Running on port: ' + port );
    });
  }

}