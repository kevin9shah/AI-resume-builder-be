import mongoose from "mongoose";
import User from "../models/user.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import Resume from "../models/Resume.js";

const generateToken = (userID) => {
    const token = jwt.sign({ userID }, process.env.JWT_SECRET, { expiresIn: "7d" })
    return token;
}

// CONTROLLER FOR USER REgistration
// POST : /api/users/register

export const registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        // check if req fields are present
        if (!name || !email || !password) {
            return res.status(400).json({ message: "missing req fields" })
        }

        // check if user already exists
        const user = await User.findOne({ email })
        if (user) {
            return res.status(400).json({ message: "user already exists" })
        }
        // create new user
        const hashedPassword = await bcrypt.hash(password, 10)
        const newUser = await User.create({ name, email, password: hashedPassword })

        // success token
        const token = generateToken(newUser._id)
        newUser.password = undefined;

        res.status(200).json({ newUser, token })

    } catch (error) {
        return res.status(400).json({ message: "error creating user", error: error.message })
    }
}

// controller for user login
// POST : /api/users/login

export const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        // check if user already exists
        const user = await User.findOne({ email })
        if (!user) {
            return res.status(400).json({ message: "invalid email or password" })
        }

        // check if password is correct
        if (!user.comparePassword(password)) {
            return res.status(400).json({ message: "invalid email or password" })
        }

        //return success message
        // success token
        const token = generateToken(user._id)
        user.password = undefined;

        res.status(201).json({ message: "login successful", user, token })

    } catch (error) {
        return res.status(400).json({ message: "error creating user", error: error.message })
    }
}

// controller for getting user by id
// GET : /api/users/data

export const getUserById = async (req, res) => {
    try {
        const userID = req.userID;

        // check if user already exists
        const user = await User.findById(userID)
        if (!user) {
            return res.status(404).json({ message: "user not found" })
        }
        // return user
        user.password = undefined;
        return res.status(200).json({ message: "user data fetched successfully", user })

    } catch (error) {
        return res.status(400).json({ message: "error creating user", error: error.message })
    }
}


// controller for getting user resumes
// GET : /api/users/resumes

export const getUserResumes = async (req, res) => {
    try {
        const userId = req.userID;

        // return user resumes
        const resumes = await Resume.find({ userId: userId })
        return res.status(200).json({ message: "user resumes fetched successfully", resumes })

    } catch (error) {
        return res.status(400).json({ message: "error creating user", error: error.message })

    }
}

