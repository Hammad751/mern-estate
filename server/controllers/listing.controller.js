import Listing from '../models/listing.model.js';
import { errorHandler } from "../utils/error.js";

export const createListing = async (req, res, next) => {
    try {
        const listing = await Listing.create(req.body);

        // 201 means somthing is created
        res.status(201).json(listing);
    } catch (error) {
        next(error)
    }
}

export const deleteListing = async (req, res, next) => {
    const listing = await Listing.findById(req.params.id);

    if(!listing) {
        return next(errorHandler(404, "list not found"));
    }

    if(req.user.id !== listing.userRef){
        return next(errorHandler(401, "you can delete onyl your data"));
    }

    try {
        await Listing.findByIdAndDelete(req.params.id);
        res.status(200).json('item deleted successfully!');
    } catch (error) {
        next(error);
    }
}

export const updateListing = async (req, res, next)=> {
    const listing = await Listing.findById(req.params.id);
    if(!listing) return next(errorHandler(404, "list not found"));

    if(req.user.id !== listing.userRef){
        return next(errorHandler(401, "you can update only yours"));
    }

    try {
        const updatedList = await Listing.findByIdAndUpdate(
            req.params.id,
            req.body,
            {new: true}
        );
        res.status(200).json(updatedList);
    } catch (error) {
        next(error)
    }
}

export const getListing = async (req, res, next) => {
    try {
        const listingid = await Listing.findById(req.params.id);
        if(!listingid){
            return next(errorHandler(404, "listing not found"));
        }
        res.status(200).json(listingid);
    } catch (error) {
        next(error)
    }
}