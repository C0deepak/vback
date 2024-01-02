const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Username is required']
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
    },
    address: {
        type: String,
        required: [true, 'Address is required']
    },
    phone: {
        type: Number,
        require: [true, 'Phone Number is required']
    },
    avatar: {
        type: String
    },
    adhaarno: {
        type: Number,
        required: [true, 'Adhaar Number is required']
    },
    work: {
        type: String,
        required: [true, 'Vehicle Type is required']
    },
    qr: {
        type: String
    },
    vehicleno: {
        type: String,
        required: [true, 'Vehicle Number is required']
    },
    vehiclebrand: {
        type: String,
        required: [true, 'Vehicle Brand is required']
    },
    vehiclemodel: {
        type: String,
        required: [true, 'Vehicle Model is required']
    },
    licenseno: {
        type: String,
        required: [true, 'License Number is required']
    },
    licenseissuedate: {
        type: String,
        required: [true, 'License issue date is required']
    },
    licenseenddate: {
        type: String,
        required: [true, 'License end date is required']
    },
    insuranceno: {
        type: String,
        required: [true, 'Insurance Number is required']
    },
    insuranceissuedate: {
        type: String,
        required: [true, 'Insurance issue date is required']
    },
    insuranceenddate: {
        type: String,
        required: [true, 'Insurance end date is required']
    },
    pucno: {
        type: String,
        required: [true, 'PUC Number is required']
    },
    pucissuedate: {
        type: String,
        required: [true, 'PUC issue date is required']
    },
    pucenddate: {
        type: String,
        required: [true, 'PUC end date is required']
    },
    password: {
        type: String,
        required: [true, 'Password is required']
    },
    role: {
        type: String,
        default: 'user'
    },
    status: {
        type: String,
        default: 'verifying'
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    tokens: [{
        token: { type: String, required: true },
    }]
})

userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) {
        next()
    }
    this.password = await bcrypt.hash(this.password, 10)
})

userSchema.methods.getJWTToken = async function () {
    let token = jwt.sign({ id: this._id }, process.env.JWT_SECRET)
    this.tokens = this.tokens.concat({ token: token })
    await this.save()
    return token
}

module.exports = mongoose.model('User', userSchema)