import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Box, Button, CircularProgress } from "@mui/material";
import Header from "./Header"; // Import the Header component
import "./ProductDetails.css";

const ProductDetails = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [cartCount] = useState(0); // Replace with actual cart count logic

  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        const response = await fetch(
          `https://catalog-management-system-dev-ak3ogf6zea-uc.a.run.app/cms/products`
        );
        const data = await response.json();
        const productData = data.products.find((item) => item.id === id || item.sku_code === id);

        if (productData) {
          setProduct({
            id: productData.id || productData.sku_code,
            image: productData.images?.front || "https://via.placeholder.com/150",
            productName: productData.name || "Unknown Product",
            price: productData.mrp?.mrp || 0,
          });
        } else {
          console.error("Product not found");
        }

        setLoading(false);
      } catch (error) {
        console.error("Error fetching product details:", error);
        setLoading(false);
      }
    };

    fetchProductDetails();
  }, [id]);

  const handleAddToCart = () => {
    alert(`${product.productName} added to cart!`);
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <CircularProgress />
      </Box>
    );
  }

  if (!product) {
    return <p>Product not found</p>;
  }

  return (
    <Box>
      <Header cartCount={cartCount} /> {/* Include Header here */}
      <Box className="product-details-container">
        <Box className="product-details-image">
          <img src={product.image} alt={product.productName} />
        </Box>
        <Box className="product-details-info">
          <h1>{product.productName}</h1>
          <h2>₹{product.price}</h2>
          <Button variant="contained" onClick={handleAddToCart}>
            Add to Cart
          </Button>
          <Button variant="outlined" onClick={() => navigate("/")}>
            Back to Products
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default ProductDetails;
