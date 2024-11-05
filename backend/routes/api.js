var express = require('express');
var router = express.Router();
const generator = require('generate-password');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken')
const User = require('../models/user')
const { sendMail } = require('../config/mail');
const authenticateToken = require('../middleware/authenticateToken');
const loginLimiter = require('../middleware/loginLimiter')
const { userValidationSchema, loginValidationSchema } = require('../util/joiValidation')

/* POST Add Admin */
//req.body:{ name, email, phone, location,password }

// router.post('/admin', async function (req, res, next) {
//     try {
//         const { name, email, phone, location, password } = req.body

//         const user = await User.findOne({ email });

//         if (user) {
//             return res.status(409).json({ message: "ADMIN with given email already Exist!" });
//         }


//         const hashedPassword = await bcrypt.hash(password, 5);

//         await new User({ name, email, phone, location, password: hashedPassword, role: 'admin' }).save();
//         res.status(201).json({ message: "ADMIN created successfully" });
//     }
//     catch (error) {
//         res.status(500).json({ message: "Internal Server Error" });
//     }
// });

/*#######################################################################################################################*/

/* POST login user. */
//req.body: {email, password}
//res: success=token
router.post('/login',loginLimiter, async function (req, res, next) {
    try {
       
        const { error } = loginValidationSchema.validate(req.body);
        if (error) {
            return res.status(400).json({ message: error.details[0].message });
        }
    
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        
        if (!user) {
            return res.status(401).json({ message: "Invalid Email or Password" });
        }
        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) {
            return res.status(401).json({ message: "Invalid Email or Password" });
        }
        
        const accessToken = jwt.sign(
            {
                "UserInfo": {
                    "name": user.email,
                    "roles": user.roles
                }
            },
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn: '10s' }
        )
        const refreshToken = jwt.sign(
            { "name": user.email },  
            process.env.REFRESH_TOKEN_SECRET,
            { expiresIn: '7d' }
        );
       
        // Create secure cookie with refresh token 
        res.cookie('jwt', refreshToken, {
            httpOnly: true,
            secure: true,
            sameSite: 'lax',
            maxAge: 7 * 24 * 60 * 60 * 1000
        });
        res.status(200).json({ token: accessToken, username: user.name,role: user.role, message: "logged in successfully" });
    }
    catch (error) {
        console.log(error)
        res.status(500).json({ message: "Internal Server Error" });
    }
});


/* POST Logout user. */
//just to clear cookie if exists
router.post('/logout', async function (req, res, next) {
    try {
        const cookies = req.cookies
        if (!cookies?.jwt) return res.sendStatus(204) //No content
        res.clearCookie('jwt', { httpOnly: true, sameSite: 'None', secure: true })
        res.json({ message: 'Cookie cleared' })
    }
    catch (error) {
        res.status(500).json({ message: "Internal Server Error" });
    }
});

/* POST Add new User */
//req.body:{ name, email, phone, location }
router.post('/user/add',authenticateToken, async function (req, res, next) {
    try {

        const { error } = userValidationSchema.validate(req.body);
        if (error) {
            return res.status(400).json({ message: error.details[0].message });
        }

        const { name, email, phone, location } = req.body

        const user = await User.findOne({ email });

        if (user) {
            return res.status(409).json({ message: "User with given email already Exist!" });
        }

        //generate a password random with  generate-password module
        const password = generator.generate({
            length: 5,
            numbers: true,
            symbols: false,
            uppercase: true,
            lowercase: true,
        });
        const hashedPassword = await bcrypt.hash(password, 5);

        await new User({ name, email, phone, location, password: hashedPassword }).save();
       
        res.status(201).json({ message: "User created successfully! Password sent over email." });
        
        await sendMail(email, "Password", `Hi ${name}, Your password to view your profile is : ${password}`);
    }
    catch (error) {
        res.status(500).json({ message: "Internal Server Error" });
    }
});

/* PATCH edit User. */
//token and userId from header
//res: success edited user
router.patch('/user/edit',authenticateToken, async function (req, res, next) {
    const { _id, name, email, phone, location } = req.body

    try {
        const foundUser = await User.findById(_id);

        if (!foundUser) {
            return res.status(404).json({ message: 'User not found' });
        }

        foundUser.name = name;
        foundUser.email = email;
        foundUser.phone = phone;
        foundUser.location = location;

        // Save user 
        await foundUser.save();

        res.status(200).json({ message: 'User details edited.' });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});


/* DELETE User by ID. */
//params : id
router.delete('/user/:id',authenticateToken, async (req, res) => {
    const { id } = req.params;

    try {
        // Find and delete the user by ID
        const user = await User.findByIdAndDelete(id);

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json({ message: "User deleted successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});


/* GET Users. */
//req.header token
//res:userList
router.get('/users',authenticateToken, (req, res, next) => {

    User.find({ role: 'user' }).then((users) => {
        res.status(200).json({ users });
    }).
        catch(errors => {
            console.log(errors)
            res.status(500).json({ message: "Internal Server Error" })
        });
});

/* GET User. */
//req.header token
//res:single user object
router.get('/user',authenticateToken, (req, res, next) => {
    const email = req.email;
    User.findOne({ email }).then((user) => {
        if (user.length === 0) {
            return res.status(404).json({ message: "No user found with this email." });
        }

        res.status(200).json({ user });
    }).
        catch(errors => {
            console.log(errors)
            res.status(500).json({ message: "Internal Server Error" })
        });
});

module.exports = router;
