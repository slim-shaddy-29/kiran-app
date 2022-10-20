const connectDatabase = require('./config/db');
const app = require('./app');
const dotenv = require('dotenv');

const UserRouter = require('./api/user');

const port = process.env.PORT || 3000;

const bodyParser = require('express').json;
app.use(bodyParser());

app.use('/user', UserRouter)


//config
dotenv.config({path:"../login_server/config/config.env"});

//database
connectDatabase()



app.listen(port, () => {
    console.log(`Server is working on https://localhost:${port}`)
})