import  express from 'express'
import dotenv from 'dotenv';
dotenv.config();
import mongoDBConnector from '../server/databaseConnector/mongoConnector/mongoConnector.js';
import router from '../server/routes/Users/usersRoutes.js';
import cors from 'cors';

const app = express()
const port = process.env.PORT_NUMBER;
const dbURL = process.env.DATABASE_URL;
const credentials = process.env.CREDENTIALS_PATH;
const dbName = process.env.DB_NAME;
const dbConnectorType = process.env.DB_CONNECTOR_TYPE
let dbConnector

app.use(cors());
app.use(express.json());

//Import in routes
//User Routes
app.use('/user', router);

app.use((req, res, next) => {
  res.setHeader("Content-Security-Policy", "default-src 'none'; connect-src 'self' http://localhost:3000; script-src 'self'; style-src 'self'");
  next();
});

//test route
app.get('/', (req, res) => {
  res.send('Hello World!')
})

function setPort(portnumber){
  app.listen(portnumber, () => {
    console.log(`Example app listening on port ${portnumber}`)
  })
}

async function connectToDB(){
  if(dbConnectorType === 'MongoDB'){
    const dbConnector = new mongoDBConnector(dbURL, credentials, dbName)
    await dbConnector.connect()
    console.log("awaiting")
    return dbConnector
  }else{
    console.error(`DB Connector of type ${dbConnectorType} not implemented. Exiting...`);
    process.exit(1); // Exit with a non-zero status code
  }
}


// Define an async function to run the server logic
async function run() {
  try {
    // Connect to the database
    dbConnector = await connectToDB()
    
    //Setup Express App
    setPort(port)
    console.log(`Server successfully created and running on Port: ${port}. Connected to DB Type: ${dbConnectorType}`)
    //TODO Need to add a command to end db connection and shut down server
  } catch (err) {
    // Log an error message
    console.error(err);
  }
}

// Run the server
run().catch(console.error);

//export dbConnector for use in other files
export {dbConnector}
