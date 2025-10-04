import express from 'express';
import bcrypt from 'bcrypt';
import User from '../models/user.js';

const userRouter = express.Router();

// Get all users
userRouter.get('/', async (req, res) => {
    try {
        const users = await User.find({});
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get user by ID
userRouter.get('/:userId', async (req, res) => {
    try {
        const user = await User.findById(req.params.userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Signup
userRouter.post('/signup', async (req, res) => {
    try {
        const { name, address, emailID, password } = req.body;

        const saltRounds = 10;
        const passwordHash = await bcrypt.hash(password, saltRounds);

        const user = new User({
            name,
            address,
            emailID,
            password: passwordHash,
        });

        const savedUser = await user.save();

        res.status(201).json(savedUser);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Login
userRouter.post('/login', async (req, res) => {
    try {
        const { emailID, password } = req.body;

        const user = await User.findOne({ emailID });

        const passwordCorrect = user === null
            ? false
            : await bcrypt.compare(password, user.password);

        if (!(user && passwordCorrect)) {
            return res.status(401).json({
                error: 'invalid email or password'
            });
        }

        res.status(200).json({ message: 'Login successful' });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

export default userRouter;