const express = require('express');
const { signUp, signIn, getUser, logout } = require('../controller/authController');
const jwtAuth = require('../middleware/jwtAuth');
const authRouter = express.Router();

authRouter.post('/signup', signUp);
authRouter.post('/signin', signIn);
authRouter.get('/user', jwtAuth,getUser);
authRouter.get('/logout',jwtAuth,logout)
module.exports = authRouter;
