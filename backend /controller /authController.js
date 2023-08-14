const userModel = require("../models/userSchema");
const emailValidator = require('email-validator')
const bcrypt = require('bcrypt')

const signUp = async (req,res,next) => {
    const {name,email,password, confirmPassword} = req.body;
    console.log(name,email,password, confirmPassword);
    if(!name) {
        return res.status(400).json({
            success: false,
            message: 'name is required'
        })
    }
    else if (!email) {
        return res.status(400).json({
            success: false,
            message: 'email is required'
        })            
    }
    else if (!password) {
        return res.status(400).json({
            success: false,
            message: 'password is required'
        })            
        
    }
    else if(!confirmPassword) {
        return res.status(400).json({
            success: false,
            message: 'this field is required'
        })            
    }
    const validateEmail = emailValidator.validate(email);
    if(!validateEmail) {
        return res.status(400).json({
            success : false,
            message: 'please provide a valid email address'
        })
    }

    if (password !== confirmPassword) {
        return res.status(400).json({
            success : false,
            message: "password does'nt match"
        })
    }
    try {

        const userInfo = userModel(req.body)
        const result = await userInfo.save();

        
        return res.status(200).json({
            success : true,
            data: result
        })     
       
    }
    catch(e) {

        if (e.code === 11000) {

            return res.status(400).json({
                success: false,
                message: 'user already exists'
            })
        }

        return res.status(400).json({
            success: false,
            message: e.message
        })
    }
}

const signIn = async (req,res,next) => {
    const {email,password} = req.body;
    if (!email) {
        return res.status(400).json({
            success : false,
            message: 'email address required'
        })
    }
    else if (!password) {
        return res.status(400).json({
            success : false,
            message: 'password is required'
        })
    }
    try {
        // find email and pass in db if exits?
        const user = await userModel.findOne({
            email
        })
        .select('+password');

        if(!user || !(await bcrypt.compare(password,user.password))) {
            return res.status(400).json({
                success : false,
                message: 'Invalid credentials'
            }) 
        }
        // if(!(await bcrypt.compare(password,user.password))) {
        //     return res.status(400).json({
        //         success : false,
        //         message: 'Invalid password'
        //     }) 
        // }
        const token = user.jwToken();
        user.password = undefined;

        const cookieOption = {
            maxAge: 24*60*60*1000,
            httpOnly: true,
        };
        res.cookie('token',token,cookieOption);
        res.status(200).json({
            success : true,
            data: user,
        })
        
    } catch (error) {
        res.status(400).json({
            success : false,
            message : error.message
        })
    }
}

const getUser = async (req,res,next) => {
    const userId = req.user.id;

    try {
        const user = await userModel.findById(userId);
        return res.status(200).json({
            success: true,
            data: user
        });

    } catch (error) {
        return res.status(400).json({
            success: false,
            message: error.message
        });
    }

}

const logout = async (req,res,next) => {
    try {
        const cookieOption = {
            expires : new Date(),
            httpOnly: true
        }
        res.cookie("token",null,cookieOption)
        res.status(200).json({
            success : true,
            message: "Logged Out"
        })
    } catch (error) {
        res.status(400).json({
            success : false,
            message: "Logout process failed"
        })
    }
}
module.exports = {
    signUp,
    signIn,
    getUser,
    logout
}
