// Cart browser ke localStorage me save rehta hai
export const getCart = () => JSON.parse(localStorage.getItem("cart") || "[]");
export const saveCart = (cart) => localStorage.setItem("cart", JSON.stringify(cart));

export const addToCart = (p, size) => {
  const cart = getCart();
  const item = cart.find((x) => x._id === p._id && x.size === size);
  if (item) item.qty++;
  else cart.push({ _id: p._id, name: p.name, price: p.price, image: p.image, size, qty: 1 });
  saveCart(cart);
};
