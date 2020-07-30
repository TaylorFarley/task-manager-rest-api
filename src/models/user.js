const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const Task = require('./task')
const multer = require('multer')
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error('email isnt valod')
            }
        },
        trim: true,
        lowercase: true
    },
    age: {
        type: Number,
        default: 0,
        validate(value) {
            if (value < 0) {
                throw new Error('age less that 0')
            }

        }
    },
    password: {
        type: String,
        trim: true,
        required: true,
        minlength: 7,
        validate(value) {
            if (value.toLowerCase().includes('password')) {
                throw new Error('must be greater than 6 and cant be password')
            }
        }
    },
    avatar: {
        type: Buffer
    },
    tokens: [{
        token: {
            type: String,
            required: true
        }
    }]
},{timestamps:true})

userSchema.virtual('tasks', {
    ref: 'Task',
    localField: '_id',
    foreignField: 'owner'
})

userSchema.methods.toJSON = function (){
    const user = this
    const userObject = user.toObject()

    delete userObject.password
    delete userObject.tokens

    return userObject
}


userSchema.methods.generateAuthToken = async function(){
const user = this
const token = jwt.sign({ _id: user._id.toString()}, 'thisismycourse')
user.tokens = user.tokens.concat({token: token})
await user.save()
return token
}


userSchema.statics.findByCredentials = async(email,password)=>{
    const user = await User.findOne({ email: email})
    if(!user){
        throw new Error('unable to login')
    }
    const isMatched = await bcrypt.compare(password, user.password)
    if(!isMatched)
    {
        throw new Error('login process bad pw')
    }
    return user

}


//Hash plain text password before saving
userSchema.pre('save',async function(next) {
    const user = this

    if(user.isModified('password')){
            user.password = await bcrypt.hash(user.password, 8)
    }


    next()
})

//delete user tasks if they delete the user
userSchema.pre('remove', async function(next){
const user = this
Task.deleteMany({ owner: user._id})
next()
})
const User = mongoose.model('User', userSchema)

module.exports = User