const mongoose = require('mongoose');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const role = require('../../roles');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minlength: 3,
        maxlength: 50
    },
    email: {
        type: String,
        required: true,
        unique: true,
        minlength: 3,
        maxlength: 255
    },
    password: {
        type: String,
        required: true,
        minlength: 4,
        maxlength: 1024
    },
    role: {
        type: String,
        required: true
    },
    saltSecrete: String
    
})

userSchema.pre("save", function (next) {
    const user = this;
    if(user.password){
        let hash = crypto.pbkdf2Sync(user.password, "salt", 32, 10, "sha512");
        user.password = hash.toString("hex");
    }
    next();
});
 
userSchema.methods.validatePassword = function(password) {
    let hashCrypto = crypto.pbkdf2Sync(password, "salt", 32, 10, "sha512");
    if(this.password) {
        return this.password = hashCrypto.toString("hex");
    }
    return false;
}

userSchema.methods.generateJwt = function(){
    let expiry = new Date();
    expiry.setMinutes(expiry.getMinutes()+30);

    let payLoadObj = {
        _id: this._id,
        email: this.email,
        role: this.role,
        exp: parseInt(expiry.getTime() / 1000)
    };
    return jwt.sign(payLoadObj, "qazwsx");
}; 



module.exports = mongoose.model("User", userSchema);