import * as express from 'express';
import * as path from 'path';
import * as bodyParser from 'body-parser';

import UserRegistrationRoutes from './routes/authentication/user_registration.router';
import ApiDocumentation from './app_configurations/api_documentation';
import { Utilities } from './utilities/utilities';
import config from './app_configurations/config';
import ContactRoutes from './routes/contacts/contact.router';




/**
 * Setup express server
 */

export default class ServerSetup{
  app = express();
  private userRegistrationRoutes: UserRegistrationRoutes;
  private apiDocumentation: ApiDocumentation;
  private contactRoutes: ContactRoutes;

  constructor(){
    this.userRegistrationRoutes = new UserRegistrationRoutes();
    this.apiDocumentation = new ApiDocumentation();
    this.contactRoutes = new ContactRoutes();
  }

  serverSetup(){
    const port = config.PORT;

    this.app.use(bodyParser.urlencoded({extended: true}));
    this.app.use(bodyParser.json());
    this.app.use(express.static(path.join(__dirname, 'public')));

    this.app.get( '/', function ( req, res )
    {
      const hostUrl = `${req.protocol}://${Utilities.getHostUrl(req, port)}`
      res.send( `Welcome to the SMS Application API. You can access the API documentation at <a href="${hostUrl}/api-docs/">here</a>` );
    })
    this.app.use(this.apiDocumentation.swaggerDocumentation());
    this.app.use(this.userRegistrationRoutes.userSignUp());
    this.app.use(this.userRegistrationRoutes.getUser());
    this.app.use(this.contactRoutes.addContact());
    this.app.use(this.contactRoutes.deleteContact());
    this.app.use(this.contactRoutes.getContacts());
    this.app.listen( port, function ()
    {
      console.log( 'Running on port: ' + port );
    });
  }

}