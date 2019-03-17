import * as express from 'express';
import * as path from 'path';
import * as bodyParser from 'body-parser';

/**
 * Setup express server
 */
const app = express();
const port = process.env.PORT || 1337;

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));


app.get( '/', function ( req, res )
{
  res.send( 'Welcome to my API' );
})


app.listen( port, function ()
{
  console.log( 'Running on port: ' + port );
});
