import * as express from 'express';
import * as path from 'path';
import * as bodyParser from 'body-parser';
import * as swaggerJSDoc from 'swagger-jsdoc';

import * as userAuthentication from './routes/authentication/user_authentication.router';

/**
 * Swagger specification
 */
const swagger_options = {
  definition: {
    swagger: '2.0',
    info: {
      title: 'SMS Management Application API',
      version: '1.0.0',
      description: 'SMS Management Application API',
    },
    host: 'localhost:1337',
    basePath: '/',
  },
  apis: ['./**/*.router.js', './**/*.router.ts'],
};

const swaggerSpec = swaggerJSDoc(swagger_options);

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

app.get('/swagger.json', function (req, res) {
    res.setHeader('Content-Type', 'application/json');
    res.send(swaggerSpec);
});

app.listen( port, function ()
{
  console.log( 'Running on port: ' + port );
});
