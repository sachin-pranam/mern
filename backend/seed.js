// Demo data frontend/src/data.js se aata hai (photos: frontend/public/shoes)
import * as data from "../frontend/src/data.js";

const noId = ({ _id, ...rest }) => rest; // MongoDB apni _id khud banayega
export const categories = data.categories.map(noId);
export const products = data.products.map(noId);
