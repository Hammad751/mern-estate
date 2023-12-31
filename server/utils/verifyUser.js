import jwt from "jsonwebtoken";
import { errorHandler } from "./error.js";

export const verifyToken = (req, res, next) => {
    // in order to get a token from cookies, we need to install pkgs
    const token = req.cookies.access_token;

    if(!token) return next(errorHandler(401, 'unauthorized user'));

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if(err) return next(errorHandler(403, 'Forbidden'));
        req.user = user;
        next();
    })

}

export const checkUserId = (req, res, next) => {
    try {
        if(req.user._id === req.params.id) {
            return next()
        }
        else{
            return next(errorHandler(403, "unauthorized user"))
        };
    } catch (error) {
        next(error)
    }
}