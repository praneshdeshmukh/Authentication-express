const mongoose = require('mongoose');
const {Schema} = mongoose;
const JWT= require('jsonwebtoken')


const userSchema = new Schema({
  name : {
    type : String,
    require: [true, "user name is required"],
    minLength: [5, "name must be atleast 5 charachters"],
    maxLength: [50, "name must be less than 50 charachters"],
    trim: true,
  },
  email : {
    type: String,
    require: [true, "user email is required"],
    unique: true,
    lowercase: true,
    unique: [true, "already registered"]
  },
  password: {
    type: String,
    select: false, 
    require: [true, "user password is required"],
  },
  forgotPasswordToken : {
    type: String
  },
  
}, {
    timestamps : true
})
userSchema.pre('save',async function (next) {
  if(!this.isModified('password')) {
    return next();
  }
  const saltRounds = 10;
  this.password = await bcrypt.hash(this.password,saltRounds);
  return next();
})
userSchema.methods = {
    jwToken() {
        return JWT.sign({
            id: this._id,
            email: this.email,
        },
        process.env.SECRET,
       )
    }
}
const userModel = mongoose.model('user', userSchema);
module.exports = userModel;
