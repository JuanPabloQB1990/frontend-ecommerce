import React, { createContext, useEffect, useState } from "react";
import useUser from "../hooks/useUser";

export const ProductContext = createContext();

const ProductProvider = ({ children }) => {
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [productsCart, setProductsCart] = useState([]);
  const [message, setMessage] = useState({ title: "", msg: "", type: "" });
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const { auth } = useUser()

  useEffect(() => {
    
    if (auth.token) {
      getCategories(auth.token);
    }

  }, [auth]);
  
  const postProduct = async (product, token) => {
    const formData = new FormData();
    formData.append("name", product.name);
    formData.append("description", product.description);
    formData.append("id_category", product.category);
    formData.append("price", product.price);
    formData.append("quantity", product.quantity);
    formData.append("rating", product.rating);

    product.images.forEach((file) => {
      formData.append("images", file);
    });

    const options = {
      method: "POST",
      headers: { Authorization: token },
      body: formData,
    };

    try {
      const res = await fetch("http://localhost:3000/products", options);
      const data = await res.json();
    } catch (error) {
      console.log(error);
    }
  };

  const getProducts = async (token) => {
    const options = {
      method: "GET",
      headers: { "Content-Type": "application/json", Authorization: token },
    };

    try {
      const res = await fetch("http://localhost:3000/products", options);
      const data = await res.json();
      return data;
    } catch (error) {
      console.log(error);
    }
  };

  const deleteProductById = async (id, token) => {
    const options = {
      method: "DELETE",
      headers: { "Content-Type": "application/json", Authorization: token },
    };

    try {
      const res = await fetch(
        `http://localhost:3000/products/product/${id}`,
        options
      );
      const data = await res.json();
    } catch (error) {
      console.log(error);
    }
  };

  const updateProductById = async (product, token) => {
    const formData = new FormData();
    formData.append("id", product.id);
    formData.append("name", product.name);
    formData.append("description", product.description);
    formData.append("id_category", product.id_category);
    formData.append("price", product.price);
    formData.append("quantity", product.quantity);
    formData.append("rating", product.rating);

    product.images.forEach((file) => {
      formData.append("images", file);
    });

    const options = {
      method: "PUT",
      headers: {
        Authorization: token,
      },
      body: formData,
    };

    try {
      const res = await fetch(
        "http://localhost:3000/products/product",
        options
      );
      const data = await res.json();
    } catch (error) {
      console.log(error);
    }
  };

  const deleteProducts = async (ids, token) => {
    const options = {
      method: "DELETE",
      body: JSON.stringify(ids),
      headers: { "Content-Type": "application/json", Authorization: token },
    };

    try {
      const res = await fetch("http://localhost:3000/products/", options);
      const data = await res.json();
    } catch (error) {
      console.log(error);
    }
  };

  const getCategories = async (token) => {
    setLoading(true)
    const options = {
      method: "GET",
      headers: { "Content-Type": "application/json", Authorization: token },
    };

    try {
      const res = await fetch("http://localhost:3000/categories", options);
      const data = await res.json();
      
      setCategories(data);
    } catch (error) {
      console.log(error);
    }

    setLoading(false)
  };

  const getProductsByCategory = async (id, token) => {
    const options = {
      method: "GET",
      headers: { "Content-Type": "application/json", Authorization: token },
    };

    try {
      const res = await fetch(`http://localhost:3000/products/${id}`, options);
      const data = await res.json();
      setProducts(data);
    } catch (error) {
      console.log(error);
    }
  };

  const addToCart = async (product, token) => {
    const options = {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: token },
      body: JSON.stringify(product),
    };

    try {
      const res = await fetch("http://localhost:3000/cart", options);
      const data = await res.json();

      setMessage({
        title: data.message,
        msg: "Satisfactoriamente",
        type: "success",
      });
    } catch (error) {
      console.log(error);
    }
  };

  const getProductsCartByIdClient = async (id, token) => {
    
    const options = {
      method: "GET",
      headers: { "Content-Type": "application/json", Authorization: token },
    };

    try {
      const res = await fetch(`http://localhost:3000/cart/${id}`, options);
      const data = await res.json();

      if (res.status === 404) {
        setMessage(data.message);
        return
      }
      setProductsCart(data);
    } catch (error) {
      console.log(error);
    }
  };

  const updateQuantityProductCart = async (id, quantity, price) => {
    
    const postQuantity = {
      id:id,
      quantity:quantity,
      price: price
    }
    
    const options = {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "Authorization": auth.token,
      },
      body: JSON.stringify(postQuantity),
    };

    try {
      const res = await fetch("http://localhost:3000/cart", options);
      const data = await res.json();

      setMessage({
        title: data.message,
        msg: "Satisfactoriamente",
        type: "success",
      });
    } catch (error) {
      console.log(error);
    }
  };

  const deleteProductCart = async(id) => {

    const options = {
      method: "DELETE",
      headers: { "Content-Type": "application/json", Authorization: auth.token },
    };

    try {
      const res = await fetch(`http://localhost:3000/cart/${id}`, options);
      const data = await res.json();
      console.log(data);
    } catch (error) {
      console.log(error);
    }
  }
  

  return (
    <ProductContext.Provider
      value={{
        postProduct,
        getCategories,
        categories,
        getProducts,
        deleteProductById,
        updateProductById,
        deleteProducts,
        getProductsByCategory,
        products,
        addToCart,
        message,
        setMessage,
        getProductsCartByIdClient,
        updateQuantityProductCart,
        loading,
        deleteProductCart,
        productsCart
      }}
    >
      {children}
    </ProductContext.Provider>
  );
};

export default ProductProvider;
