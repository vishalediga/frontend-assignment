import React, { useState, useEffect, useCallback } from "react";
import {
  Box,
  Button,
  IconButton,
  TextField,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Badge,
  Pagination,
  CircularProgress,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import CloseIcon from "@mui/icons-material/Close";
import { useNavigate } from "react-router-dom";
import "./ProductTable.css";

const ITEMS_PER_PAGE = 8;

const ProductTable = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [lazyLoading, setLazyLoading] = useState(false);
  const [cart, setCart] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [categories, setCategories] = useState([]);
  const [sortOrder, setSortOrder] = useState(null);
  const [isCartOpen, setCartOpen] = useState(false);
  const [address, setAddress] = useState("");

  const navigate = useNavigate();

  // Load state from localStorage on initial render
  useEffect(() => {
    const savedCart = JSON.parse(localStorage.getItem("cart")) || [];
    const savedPage = Number(localStorage.getItem("currentPage")) || 1;
    const savedSearchQuery = localStorage.getItem("searchQuery") || "";
    const savedCategoryFilter = localStorage.getItem("categoryFilter") || "All";
    const savedSortOrder = localStorage.getItem("sortOrder") || null;
    const savedAddress = localStorage.getItem("address") || "";

    setCart(savedCart);
    setCurrentPage(savedPage);
    setSearchQuery(savedSearchQuery);
    setCategoryFilter(savedCategoryFilter);
    setSortOrder(savedSortOrder);
    setAddress(savedAddress);
  }, []);

  // Save state to localStorage whenever it updates
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem("currentPage", currentPage);
  }, [currentPage]);

  useEffect(() => {
    localStorage.setItem("searchQuery", searchQuery);
  }, [searchQuery]);

  useEffect(() => {
    localStorage.setItem("categoryFilter", categoryFilter);
  }, [categoryFilter]);

  useEffect(() => {
    localStorage.setItem("sortOrder", sortOrder);
  }, [sortOrder]);

  useEffect(() => {
    localStorage.setItem("address", address);
  }, [address]);

  // Memoize the applyFilters function
  const applyFilters = useCallback(
    (query, category, order = sortOrder, productList = products) => {
      let filtered = [...productList];

      if (query) {
        filtered = filtered.filter((product) =>
          product.productName.toLowerCase().includes(query)
        );
      }

      if (category !== "All") {
        filtered = filtered.filter((product) => product.category === category);
      }

      if (order === "asc") {
        filtered.sort((a, b) => a.mrp - b.mrp);
      } else if (order === "desc") {
        filtered.sort((a, b) => b.mrp - a.mrp);
      }

      setFilteredProducts(filtered);
    },
    [products, sortOrder]
  );

  // Fetch products and initialize categories
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch(
          "https://catalog-management-system-dev-ak3ogf6zea-uc.a.run.app/cms/products"
        );
        const data = await response.json();

        const formattedProducts = data.products.map((product) => ({
          id: product.id || product.sku_code,
          image: product.images?.front || "https://via.placeholder.com/100",
          productName: product.name || "Unknown Product",
          mrp: product.mrp?.mrp || 0,
          quantity: 1,
          category: product.main_category || "Uncategorized",
        }));

        const uniqueCategories = [
          "All",
          ...new Set(data.products.map((product) => product.main_category || "Uncategorized")),
        ];

        setProducts(formattedProducts);
        setCategories(uniqueCategories);

        // Apply saved filters and search query
        applyFilters(searchQuery, categoryFilter, sortOrder, formattedProducts);

        setLoading(false);
      } catch (error) {
        console.error("Error fetching product data:", error);
        setLoading(false);
      }
    };

    fetchProducts();
  }, [applyFilters, searchQuery, categoryFilter, sortOrder]);

  const handleProductClick = (id) => {
    navigate(`/product/${id}`);
  };

  const updateQuantity = (id, change) => {
    setFilteredProducts((prevProducts) =>
      prevProducts.map((product) =>
        product.id === id
          ? { ...product, quantity: Math.max(1, product.quantity + change) }
          : product
      )
    );
  };

  const addToCart = (product) => {
    setCart((prevCart) => {
      const existingProduct = prevCart.find((item) => item.id === product.id);
      if (existingProduct) {
        return prevCart.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + product.quantity }
            : item
        );
      }
      return [...prevCart, { ...product }];
    });
    alert(`${product.productName} added to cart!`);
  };

  const handleSearch = (event) => {
    const query = event.target.value.toLowerCase();
    setSearchQuery(query);
    applyFilters(query, categoryFilter);
    setCurrentPage(1);
  };

  const handleCategoryFilter = (event) => {
    const category = event.target.value;
    setCategoryFilter(category);
    applyFilters(searchQuery, category);
    setCurrentPage(1);
  };

  const handleSort = (order) => {
    setSortOrder(order);
    applyFilters(searchQuery, categoryFilter, order);
  };

  const toggleCart = () => {
    setCartOpen(!isCartOpen);
  };

  const placeOrder = () => {
    if (!address.trim()) {
      alert("Please enter your address to place the order.");
      return;
    }

    alert("Order placed successfully!");
    setCart([]);
    setAddress("");
    setCartOpen(false);
  };

  const handlePageChange = (event, page) => {
    setLazyLoading(true);
    setTimeout(() => {
      setCurrentPage(page);
      setLazyLoading(false);
    }, 500);
  };

  const getPaginatedData = () => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredProducts.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box className="main-container">
      <Box className="header">
        <h1>Vishal Mart</h1>
        <IconButton onClick={toggleCart}>
          <Badge badgeContent={cart.length} color="secondary">
            <ShoppingCartIcon />
          </Badge>
        </IconButton>
      </Box>

      <Box className="content">
        <Box className="filters-container">
          <TextField
            label="Search Products"
            variant="outlined"
            fullWidth
            value={searchQuery}
            onChange={handleSearch}
            style={{ marginBottom: "20px" }}
          />
          <TextField
            select
            label="Filter by Category"
            variant="outlined"
            fullWidth
            value={categoryFilter}
            onChange={handleCategoryFilter}
            style={{ marginBottom: "20px" }}
          >
            {categories.map((category) => (
              <MenuItem key={category} value={category}>
                {category}
              </MenuItem>
            ))}
          </TextField>
          <Button
            variant={sortOrder === "asc" ? "contained" : "outlined"}
            onClick={() => handleSort("asc")}
            style={{ marginBottom: "10px" }}
          >
            Sort by Price (ASC)
          </Button>
          <Button
            variant={sortOrder === "desc" ? "contained" : "outlined"}
            onClick={() => handleSort("desc")}
          >
            Sort by Price (DESC)
          </Button>
        </Box>

        <Box className="products-container">
          {lazyLoading ? (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="50vh">
              <CircularProgress />
            </Box>
          ) : (
            getPaginatedData().map((product) => (
              <Box
                key={product.id}
                className="product-item"
                onClick={() => handleProductClick(product.id)}
                style={{ cursor: "pointer" }}
              >
                <img src={product.image} alt={product.productName} />
                <h3>{product.productName}</h3>
                <p>Price: ₹{product.mrp}</p>
                <Box display="flex" justifyContent="space-between" alignItems="center">
                  <IconButton onClick={(e) => {
                    e.stopPropagation();
                    updateQuantity(product.id, -1);
                  }}>
                    <RemoveIcon />
                  </IconButton>
                  <span>{product.quantity}</span>
                  <IconButton onClick={(e) => {
                    e.stopPropagation();
                    updateQuantity(product.id, 1);
                  }}>
                    <AddIcon />
                  </IconButton>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={(e) => {
                      e.stopPropagation();
                      addToCart(product);
                    }}
                  >
                    Add to Cart
                  </Button>
                </Box>
              </Box>
            ))
          )}
        </Box>
      </Box>

      <Box display="flex" justifyContent="center" marginTop="20px">
        <Pagination
          count={Math.ceil(filteredProducts.length / ITEMS_PER_PAGE)}
          page={currentPage}
          onChange={handlePageChange}
        />
      </Box>

      <Dialog open={isCartOpen} onClose={toggleCart}>
        <DialogTitle>
          Your Cart
          <IconButton onClick={toggleCart} style={{ position: "absolute", right: 8, top: 8 }}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          {cart.map((item) => (
            <Box key={item.id} display="flex" justifyContent="space-between" alignItems="center">
              <span>{item.productName}</span>
              <span>Qty: {item.quantity}</span>
              <span>₹{item.mrp * item.quantity}</span>
            </Box>
          ))}
          <TextField
            label="Address"
            variant="outlined"
            fullWidth
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            style={{ marginTop: "20px" }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={placeOrder} variant="contained" color="primary">
            Place Order
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ProductTable;
