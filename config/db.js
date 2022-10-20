require('dotenv').config();
const mongoose = require("mongoose");


const connectDatabase = () => {
    mongoose
        .connect(process.env.MONGODB_URI, {useNewUrlParser: true, useUnifiedTopology: true,})
        .then((data) => {console.log(`DB connected with server ${data.connection.host}`);})
        .catch((err) => {console.log(err);});
}

module.exports = connectDatabase