const User = require('../models/userSchema')
const bcrypt = require('bcrypt')
// const sendToken = require('../createjwt')
const qrcode = require('qrcode')
const jwt = require('jsonwebtoken')

exports.registerUser = async (req, res, next) => {

    const { name, email, address, phone, adhaarno, work, vehicleno, vehiclebrand, vehiclemodel, licenseno, licenseissuedate, licenseenddate, insuranceno, insuranceissuedate, insuranceenddate, pucno, pucissuedate, pucenddate, password } = req.body

    try {
        const userExist = await User.findOne({ email: email })
        if (userExist) {
            return res.status(422).json({ error: 'Email already exist!' })
        }
        const user = await User.create({
            name, email, address, phone, adhaarno, work, vehicleno, vehiclebrand, vehiclemodel, licenseno, licenseissuedate, licenseenddate, insuranceno, insuranceissuedate, insuranceenddate, pucno, pucissuedate, pucenddate, password
        })

        const qrSaveData = { Name: user.name, Email: user.email, Address: user.address, Phone: user.phone, VehicleNo: user.vehicleno, LicenseNo: user.licenseno, InsuranceNo: user.insuranceno, Status: user.status }
        const genenrateQr = async text => {
            try {
                const qrDataUrl = await qrcode.toDataURL(text)
                user.qr = qrDataUrl
                await user.save()
            }
            catch (err) {
                console.log(err)
            }
        }
        genenrateQr(JSON.stringify(qrSaveData))

        res.status(200).json({
            success: true,
            msg: 'User Registered in Successfully!'
        })
    }
    catch (err) {
        console.log(err)
    }

}

exports.loginUser = async (req, res, next) => {

    const { email, password } = req.body

    try {
        const user = await User.findOne({ email: email })
        if (!user) {
            return res.status(400).json({ error: 'Invalid credentials!' })
        }
        const matchPassword = await bcrypt.compare(password, user.password);
        if (!matchPassword) {
            return res.status(400).json({ error: 'Invalid credentials!' })
        }
        else {
            token = await user.getJWTToken();
            res.cookie('vedantaqrtoken', token, {
                expires: new Date(Date.now() + 25892000000),
                httpOnly: true
            });

            res.status(200).json({
                success: true,
                msg: 'User Sign in Successfully!',
                token: token,
                user: user.toObject()
            })
        }
    }
    catch (err) {
        console.log(err)
    }

}

exports.logoutUser = async (req, res, next) => {

    res.clearCookie('vedantaqrtoken', {
        path: '/',
        expires: new Date(Date.now()),
        httpOnly: true
    })

    res.status(200).json({
        success: true,
        message: "Logged Out successfully"
    })

}

exports.profile = async (req, res, next) => {
    // const user = await User.findById(req.user.id)
    const { token } = req.body
    token = JSON.parse(token)
    console.log(token)
    try {
        const decodedData = jwt.verify(token, process.env.JWT_SECRET)
        const rootUser = await User.findOne({ _id: decodedData.id, "tokens.token": token })

        if (rootUser) {
            res.status(200).json({
                success: true,
                msg: 'User Found!',
                user: rootUser
            })
        }
    }
    catch(error){
        console.log(error)
    }

}

exports.detailUser = async (req, res, next) => {
    const reqUser = await User.findById(req.params.id)
    req.reqUser = reqUser
    res.send(reqUser)

}

exports.allUser = async (req, res, next) => {

    const user = await User.find()
    res.status(200).json({
        success: true,
        user
    })

}