const express = require('express');
const app = express();
const authRouter = require('./routes/authRouter.js');
const databaseConnect = require('./config/databaseConfig.js');
const cookieParser = require('cookie-parser')
const cors = require('cors')
databaseConnect();

app.use(express.json()); // only accepts json
app.use(cookieParser());
app.use('/api/auth/',authRouter);
app.use(cors({
    origin: [process.env.CLIENT_URL],
    credentials: true // cookies allow
}))
app.use('/',(req,res) => {
    //because we only accept json so we have to use .json({})
    res.status(200).json({data : 'JWTauth server. updated yo'});
});
module.exports = app;
