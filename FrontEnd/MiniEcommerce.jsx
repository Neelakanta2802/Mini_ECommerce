import { useEffect, useState } from "react";
import axios from "axios";

export default function MiniECommerce() {
    const [products, setProducts] = useState([]);
    const [cart, setCart] = useState([]);
    const [searchText, setSearchText] = useState("");
    const [category, setCategory] = useState("All");
    const [sort, setSort] = useState("Default");
    const [error, setError] = useState("");

    const [checkoutForm, setCheckoutForm] = useState({
        name: "",
        email: "",
        phone: "",
        address: ""
    });

    const getProducts = async () => {
        try {
            const response = await axios.get("https://dummyjson.com");
            setProducts(response.data.products);
        } catch (error) {
            setError("Failed to fetch products");
        }
    };

    useEffect(() => {
        getProducts();
    }, []);

    const addToCart = (product) => {
        const existingItem = cart.find(item => item.id === product.id);

        if (existingItem) {
            setCart(
                cart.map(item =>
                    item.id === product.id
                        ? { ...item, quantity: item.quantity + 1 }
                        : item
                )
            );
        } else {
            setCart([...cart, { ...product, quantity: 1 }]);
        }
    };

    const increaseQuantity = (id) => {
        setCart(
            cart.map(item =>
                item.id === id ? { ...item, quantity: item.quantity + 1 } : item
            )
        );
    };

    const decreaseQuantity = (id) => {
        const item = cart.find(item => item.id === id);

        if (item.quantity === 1) {
            removeFromCart(id);
            return;
        }

        setCart(
            cart.map(item =>
                item.id === id ? { ...item, quantity: item.quantity - 1 } : item
            )
        );
    };

    const removeFromCart = (id) => {
        setCart(cart.filter(item => item.id !== id));
    };

    const handleCheckoutChange = (e) => {
        const { name, value } = e.target;
        setCheckoutForm({
            ...checkoutForm,
            [name]: value
        });
    };

    const placeOrder = (e) => {
        e.preventDefault();

        if (cart.length === 0) {
            setError("Your cart is empty");
            return;
        }

        setError("");

        const order = {
            customer: checkoutForm,
            items: cart,
            total: total
        };

        console.log(order);
        alert("Order placed successfully!");

        setCart([]);
        setCheckoutForm({
            name: "",
            email: "",
            phone: "",
            address: ""
        });
    };

    const filteredProducts = products.filter((product) => {
        const matchesSearch = product.title?.toLowerCase().includes(searchText.toLowerCase());
        const matchesCategory = category === "All" || product.category === category;
        return matchesSearch && matchesCategory;
    });

    let sortedProducts = [...filteredProducts];
    if (sort === "LowToHigh") {
        sortedProducts.sort((a, b) => a.price - b.price);
    } else if (sort === "HighToLow") {
        sortedProducts.sort((a, b) => b.price - a.price);
    }

    const categories = [...new Set(products.map(product => product.category).filter(Boolean))];

    const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

    return (
        <div style={{ padding: "20px", fontFamily: "sans-serif", maxWidth: "1200px", margin: "0 auto" }}>
            <h1>Mini E-Commerce</h1>

            {error && <p style={{ color: "red" }}>{error}</p>}

            <h2>Products</h2>

            <div style={{ marginBottom: "20px", display: "flex", gap: "10px" }}>
                <input
                    type="text"
                    placeholder="Search products..."
                    value={searchText}
                    onChange={(e) => setSearchText(e.target.value)}
                />

                <select value={category} onChange={(e) => setCategory(e.target.value)}>
                    <option value="All">All Categories</option>
                    {categories.map(item => (
                        <option key={item} value={item}>{item}</option>
                    ))}
                </select>

                <select value={sort} onChange={(e) => setSort(e.target.value)}>
                    <option value="Default">Default Sorting</option>
                    <option value="LowToHigh">Price: Low to High</option>
                    <option value="HighToLow">Price: High to Low</option>
                </select>
            </div>

            {/* Changed to CSS Grid: Exactly 4 products per row */}
            <div style={{ 
                display: "grid", 
                gridTemplateColumns: "repeat(4, 1fr)", 
                gap: "20px",
                marginBottom: "40px"
            }}>
                {sortedProducts.map(product => (
                    <div key={product.id} style={{ 
                        border: "1px solid #eee", 
                        padding: "15px", 
                        borderRadius: "8px",
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "between",
                        backgroundColor: "#fff",
                        boxShadow: "0 2px 4px rgba(0,0,0,0.05)"
                    }}>
                        <img 
                            src={product.thumbnail} 
                            alt={product.title} 
                            style={{ width: "100%", height: "150px", objectFit: "cover", borderRadius: "4px" }} 
                        />
                        <h3 style={{ fontSize: "1rem", margin: "10px 0 5px 0" }}>{product.title}</h3>
                        <p style={{ fontWeight: "bold", margin: "0 0 5px 0" }}>Price: ₹{product.price}</p>
                        <p style={{ fontSize: "0.85em", color: "#666", margin: "0 0 5px 0" }}>Category: {product.category}</p>
                        <p style={{ 
                            fontSize: "0.85em", 
                            color: product.stock < 5 ? "orange" : "green",
                            margin: "0 0 15px 0"
                        }}>
                            Stock: {product.stock}
                        </p>
                        <button
                            onClick={() => addToCart(product)}
                            disabled={product.stock === 0}
                            style={{ 
                                marginTop: "auto",
                                width: "100%", 
                                padding: "8px", 
                                cursor: product.stock === 0 ? "not-allowed" : "pointer",
                                background: product.stock === 0 ? "#ccc" : "#007bff",
                                color: "#fff",
                                border: "none",
                                borderRadius: "4px"
                            }}
                        >
                            {product.stock === 0 ? "Out of Stock" : "Add to Cart"}
                        </button>
                    </div>
                ))}
            </div>

            <h2>Cart</h2>
            {cart.length === 0 && <p>Cart is empty</p>}
            
            <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginBottom: "20px" }}>
                {cart.map(item => (
                    <div key={item.id} style={{ display: "flex", alignItems: "center", gap: "15px", borderBottom: "1px solid #eee", paddingBottom: "10px" }}>
                        <img src={item.thumbnail} alt={item.title} width="60" />
                        <div style={{ flex: 1 }}>
                            <h4>{item.title}</h4>
                            <p>₹{item.price} × {item.quantity}</p>
                        </div>
                        <div>
                            <button onClick={() => decreaseQuantity(item.id)}>-</button>
                            <span style={{ margin: "0 10px" }}>{item.quantity}</span>
                            <button onClick={() => increaseQuantity(item.id)}>+</button>
                            <button onClick={() => removeFromCart(item.id)} style={{ marginLeft: "15px", color: "red" }}>Remove</button>
                        </div>
                    </div>
                ))}
            </div>

            <h3>Total: ₹{total.toFixed(2)}</h3>

            <h2>Checkout</h2>
            <form onSubmit={placeOrder} style={{ display: "flex", flexDirection: "column", gap: "10px", maxWidth: "300px" }}>
                <input required name="name" placeholder="Full Name" value={checkoutForm.name} onChange={handleCheckoutChange} />
                <input required type="email" name="email" placeholder="Email Address" value={checkoutForm.email} onChange={handleCheckoutChange} />
                <input required type="tel" name="phone" placeholder="Phone Number" value={checkoutForm.phone} onChange={handleCheckoutChange} />
                <input required name="address" placeholder="Shipping Address" value={checkoutForm.address} onChange={handleCheckoutChange} />
                <button type="submit" style={{ padding: "10px", background: "#28a745", color: "white", border: "none", borderRadius: "4px", cursor: "pointer" }}>
                    Place Order
                </button>
            </form>
        </div>
    );
}
