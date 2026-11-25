import { useState } from "react";
import { API, img } from "./api";
import { getCart, saveCart } from "./cartStore";
import Nav from "./Nav";

export default function Cart() {
  const [cart, setCart] = useState(getCart());
  const [done, setDone] = useState(false);

  const update = (newCart) => { saveCart(newCart); setCart(newCart); };
  const changeQty = (i, n) => update(cart.map((x, j) => (j === i ? { ...x, qty: x.qty + n } : x)).filter((x) => x.qty > 0));
  const total = cart.reduce((sum, x) => sum + x.price * x.qty, 0);

  const placeOrder = async (e) => {
    e.preventDefault();
    const order = { ...Object.fromEntries(new FormData(e.target)), items: cart, total };
    const res = await fetch(API + "/api/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(order),
    }).catch(() => null);
    if (!res?.ok) return alert("Order fail ho gaya. Backend aur MongoDB chalu hai?");
    update([]);
    setDone(true);
  };

  if (done)
    return (
      <>
        <Nav />
        <div className="done">
          <h2>Order Placed!</h2>
          <p>Thank you for shopping with Sachin Shoe Store. We will call you soon to confirm.</p>
          <a href="/" className="btn">Continue Shopping</a>
        </div>
      </>
    );

  return (
    <>
      <Nav />
      <section>
        <h2 className="title">My Cart</h2>
        {cart.length === 0 ? (
          <p className="empty">Cart is empty. <a href="/">Shop now →</a></p>
        ) : (
          <div className="checkout">
            <div>
              {cart.map((x, i) => (
                <div className="cart-item" key={i}>
                  <img src={img(x.image)} alt={x.name} />
                  <div>
                    <h3>{x.name}</h3>
                    <small>Size: UK {x.size}</small>
                    <b>₹{x.price}</b>
                  </div>
                  <div className="qty">
                    <button onClick={() => changeQty(i, -1)}>−</button>
                    <span>{x.qty}</span>
                    <button onClick={() => changeQty(i, 1)}>+</button>
                  </div>
                </div>
              ))}
              <h3 className="total">Total: ₹{total}</h3>
            </div>

            <form className="order-form" onSubmit={placeOrder}>
              <h3>Delivery Details</h3>
              <input name="name" placeholder="Full Name" required />
              <input name="phone" placeholder="Mobile Number" pattern="[0-9]{10}" title="10 digit mobile number" required />
              <textarea name="address" placeholder="Full Address" required />
              <input name="city" placeholder="City" required />
              <input name="pincode" placeholder="Pincode" pattern="[0-9]{6}" title="6 digit pincode" required />
              <p>Payment: <b>Cash on Delivery</b></p>
              <button className="buy">Place Order (₹{total})</button>
            </form>
          </div>
        )}
      </section>
    </>
  );
}
