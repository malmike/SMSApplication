// import * as express from 'express';
// import * as path from 'path';
// import * as bodyParser from 'body-parser';
// import * as mongoose from 'mongoose';

// import UserAuthentication from './routes/authentication/user_authentication.router';
// import ApiDocumentation from './api_documentation'
// import { Utilities } from './utilities/utilities';
// import config from './config';

// mongoose.connect(config.DB_URI);
// const userAuthentication = new UserAuthentication();
// const apiDocumentation = new ApiDocumentation();

// /**
//  * Setup express server
//  */
// const app = express();
// const port = config.PORT;

// app.use(bodyParser.urlencoded({extended: true}));
// app.use(bodyParser.json());
// app.use(express.static(path.join(__dirname, 'public')));

// app.use(apiDocumentation.swaggerDocumentation())
// app.use(userAuthentication.getUser());
// app.use(userAuthentication.userSignUp());

// app.get( '/', function ( req, res )
// {
//   const hostUrl = `${req.protocol}://${Utilities.getHostUrl(req, port)}`
//   res.send( `Welcome to the SMS Application API. You can access the API documentation at <a href="${hostUrl}/api-docs/">here</a>` );
// })

// app.listen( port, function ()
// {
//   console.log( 'Running on port: ' + port );
// });

import DBConfig from './app_configurations/db_config';
import ServerSetup from './server';

const dbConfig = new DBConfig();
const serverSetup = new ServerSetup();

dbConfig.dbConnection().then( ()=> {
  serverSetup.serverSetup();
})
