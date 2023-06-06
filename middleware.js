const User = require('./models/userSchema')
const jwt = require('jsonwebtoken')

exports.isAuthenticatedUser = async (req, res, next) => {

    try {
        const token = req.cookies.vedantaqrtoken
        if (!token) {
            return res.status(401).json({ error: 'Please Login to access this resource!' })
        }
        const decodedData = jwt.verify(token, process.env.JWT_SECRET)
        const rootUser = await User.findOne({ _id: decodedData.id, "tokens.token": token })

        if(!rootUser){throw new Error('User not Found')}

        req.rootUser = rootUser
        next()
    }
    catch (err) {
        console.log(err)
    }

}

exports.isAdmin = async (req, res, next) => {

    if (req.rootUser.role !== 'Admin') {
        return res.status(401).json({ error: 'Only Admin can access this resource!' })
    }
    next()

}