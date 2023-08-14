const mongoose = require('mongoose');

const MONGO_URL = process.env.MONGODB_URL || "mongodb://localhost:27017/my_database";

const databaseConnect = () => {
    mongoose
    .connect(MONGO_URL)
    .then((conn)=> console.log(`CONNECTED TO DB: ${conn.connection.host}`))
    .catch((err)=> console.log(err.message));
}

module.exports = databaseConnect;
