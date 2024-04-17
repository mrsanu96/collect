import mongoose, { Schema } from "mongoose";

// Define the schema for NFT data
const nftSchema = new Schema({
    tokenId: {
        type: Number,
        trim: true, // Trim whitespace from the value
        required: true // Make the field required
    },
    tokenName: {
        type: String,
        trim: true // Trim whitespace from the value
    },
    tokenPrice: {
        type: String,
        trim: true // Trim whitespace from the value
    },
    walletAddress: {
        type: String,
        trim: true // Trim whitespace from the value
    },
    date: {
        type: Date,
        default: Date.now // Set default value to the current date/time
    }
});

// Create or retrieve the model for NFT data
const NFTDATA = mongoose.models.NFTDATA || mongoose.model("NFTDATA", nftSchema);

export default NFTDATA;
