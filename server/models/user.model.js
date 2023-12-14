import mongoose from "mongoose";

// rules for creating database is called schema
const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
},{timestamps: true});

// create user model
const User = mongoose.model('User', userSchema);

export default User;