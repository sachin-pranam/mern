import * as demo from "./data";

export const API = "http://localhost:5000";

// Uploaded image backend se aati hai, baaki photos frontend/public se
export const img = (src) => (src.startsWith("/uploads") ? API + src : src);

// Backend se data lao. Backend/MongoDB band ho to hardcoded demo data dikhao
export const get = (type) =>
  fetch(API + "/api/" + type).then((r) => r.json()).catch(() => demo[type]);
