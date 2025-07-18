import mongoose from 'mongoose';
const shopSchema = new mongoose.Schema({
    userId: { type: String, required: true, ref: "user" },
    name: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    offerPrice: { type: Number, required: false },
    image: { type: Array, required: true },
    category: { type: String, required: true },
    date: { type: Number, required: true },
})

const Shop = mongoose.models.shop || mongoose.model('shop', shopSchema);

export default Shop;
