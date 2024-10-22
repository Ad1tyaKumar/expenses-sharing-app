import mongoose from "mongoose";
import jwt from 'jsonwebtoken';
const Schema = mongoose.Schema;
const userSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique : true,
        validate : {
            validator : function (v : string) {
                return /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(v);
            },
            message : (props: { value: any; }) => `${props.value} is not a valid email`
        }
    },
    phone :{
        type : String,
        unique : true,
        required : true,
        validate : {
            validator : function (v : string) {
                return v.length === 10;
            },
            message : (props: { value: any; }) => `${props.value} is not a valid phone number`
        }
    },
    password: {
        type: String,
        required: true
    }
});

userSchema.methods.getJwtToken = function () {
    return jwt.sign({ id: this._id }, process.env.JWT_SECRET!, {
        expiresIn: '7d'
    });
}

const User = mongoose.model('User', userSchema);


export default User;
