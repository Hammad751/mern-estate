import User from '../models/user.model.js'
import bcryptjs from 'bcryptjs';
import { errorHandler } from '../utils/error.js';
import jwt from 'jsonwebtoken';

export const signup = async (req,res, next) =>{
    const { username, email, password } = req.body;
    const hashedPass = bcryptjs.hashSync(password, 10);
    const newUser = new User({username, email, password: hashedPass});

    try {
        await newUser.save();
        res.status(200).json("user data saved successfully");
    } catch (error) {
        next(error);
    }
}

export const signin = async (req, res, next) => {
    const { email, password } = req.body;

    try {
        const validUser = await User.findOne({email});
        const validPassword = bcryptjs.compareSync(password, validUser.password);
        // const param = req.params.email;
        // console.log("param", param);
        if(!validUser) return next(errorHandler(404, 'user not found'));
        if(!validPassword) return next(errorHandler(401, 'wrong credentials'));

        // to secure the users, we create the jsonwebtokens. this will generate the hashed values of users
        // we create the hash against user-id as it is the best practice for doing this 
        const token = await jwt.sign({id: validUser._id}, process.env.JWT_SECRET);

        // make the password secure from throwing into the generated hash
        const {password: pass, ...rest} = validUser._doc;
        // after token creation, we use cookeis for users
        // for making http true, it is used to secure user data from third party access
        res
        .cookie('access_token', token, {httpOnly: true})
        .status(200)
        .json(rest);
        // console.log("token: ", token);
    } catch (error) {
        next(error)
    }
}

export const google = async (req, res, next) => {
    try {
        const user = await User.findOne({email: req.body.email});
        if(user){
            const token = await jwt.sign({id: user._id}, process.env.JWT_SECRET);
            const {password: pass, ... rest} = user._doc;

            // create a response, for that, we save cookies
            res
            .cookie('access_token', token, {httpOnly: true})
            .status(200)
            .json(rest)
        }
        else{
            const generatedPassword = Math.random().toString(36).slice(-8)+Math.random().toString(36).slice(-8);
            const hashedPass = await bcryptjs.hashSync(generatedPassword, 10);
            const userData = req.body;
            const _username = req.body.name.split(" ").join("").toLowerCase() + Math.random().toString(36).slice(-4);
            const newUser = new User({username: _username, email: userData.email, password: hashedPass, avatar: userData.photo});

            await newUser.save();

            const token = jwt.sign({id: newUser._id}, process.env.JWT_SECRET);
            const {password, ...rest} = newUser._doc;

            res.cookie(access_token, token, {httpOnly: true}).status(200).json(rest);
        }
    } catch (error) {
        next(error);
    }
}