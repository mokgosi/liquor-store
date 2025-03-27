import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    _id: { 
        type: String, 
        required: true 
    },
    name: {
        type: String,
        required: true,
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
    image: {
        type: String,
        required: true,
    },
    cartItems: {
        type: Object,
        default: {},
    },
    // role: {
    //     type: String,
    //     required: true,
    // },
    // createdAt: {
    //     type: Date,
    //     required: true,
    // },
    // updatedAt: {
    //     type: Date,
    //     required: true,
    // },
},{minimize: false});

const User = mongoose.models.user || mongoose.model('user', userSchema);

// export default mongoose.model("User", userSchema);
export default User;