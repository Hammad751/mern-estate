import bcryptjs from "bcryptjs";
import { errorHandler }  from "../utils/error.js"
import User from '../models/user.model.js';

export const test = (req,res) =>{
    res.send("user controller file ")
}

//* to update a user, after signing in, 
//* we create a token to authenticate the user before it updates the profile
export const updateUser = async (req, res, next) => {
    if(req.user.id !== req.params.id) return next(errorHandler(401, "user not authenticated"));

    try {
        if(req.body.password){
            req.body.password = bcryptjs.hashSync(req.body.password, 10); 
        }

        const updatedUser = await User.findByIdAndUpdate(req.params.id,{
            // set method is used to update the data before checking it.
            // whether if all the fields are updated or not
            $set:{
                username: req.body.username,
                email: req.body.email,
                password: req.body.password,
                avatar: req.body.avatar
            }

            //* we are using new: true as if we don't use it, 
            //* this will return the previous data not the updated.
        }, {new: true})

        const {password, ...rest} = updatedUser._doc;
        res.status(200).json(rest);
    } catch (error) {
        next(error);
    }
};

export const deleteUser = async (req, res, next) => {
    // req.user have the data getting from jwt
    if(req.user.id !== req.params.id) return next(errorHandler(403, "you can delete your own account"));

    try {
        await User.findByIdAndDelete(req.params.id);
        // res.clearCookie('access_token');
        res.clearCookie('access_token').status(200).json("user has been deleted!!!");   
    } catch (error) {
        next(error)
    }
}