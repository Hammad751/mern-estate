import Listing from "../models/listing.model.js ";
export const createListing = async (req, res, next) => {
    try {
        const listing = await Listing.create(req.body);

        // 201 means somthing is created
        return res.status(201).json(listing);
    } catch (error) {
        next(error)
    }
}