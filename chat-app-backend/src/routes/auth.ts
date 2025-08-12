const express = require('express');
const router = express.Router();
import User from '../models/User';
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const JWT_EXPIRES_IN = '7d';

// Signup route
router.post('/signup', async (req, res) => {
    try {
        const {username, email, password} = req.body;
        if(!username || !email || !password) {
            return res.status(400).json({message: 'username, email and password are required'});
        }
        const existing = await User.findOne({ $or: [{ email }, { username }] });
        if(existing) return res.status(400).json({message: 'User already exists with this email or username'});

        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(password, salt);

        const user = new User({
            username,
            email,
            passwordHash
        });

        await user.save();
        const token = jwt.sign(
            { 
                id: user._id, 
                username: user.username 
            }, 
            process.env.JWT_SECRET, 
            { expiresIn: JWT_EXPIRES_IN }
        );

        res.status(201).json({
            token,
            user : {
                id: user._id,
                username: user.username,
                email: user.email,
                createdAt: user.createdAt
            }
        })
    } catch(err) {
        console.error(err);
        res.status(500).json({message: 'Internal server error'});
    }
});

// Login route

router.post('/login', async (req, res) => {
    try {
        const {email, password} = req.body;
        if(!email || !password) {
            return res.status(400).json({message: 'Email and password are required'});
        }

        const user = await User.findOne({ email });
        if(!user) return res.status(400).json({message: 'User not found or Invalid Credentials'});
    
        const isMatch = await bcrypt.compare(password, user.passwordHash);
        if(!isMatch) return res.status(400).json({message: 'Invalid Credentials'});

        const token = jwt.sign(
            {id: user._id, username: user.username},
            process.env.JWT_SECRET,
            {expiresIn: JWT_EXPIRES_IN}
        )

        res.json({
            token,
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                createdAt: user.createdAt
            }
        });
    } catch(err) {
        console.error(err);
        res.status(500).json({message: 'Internal server error'});
    }
})

export default router;