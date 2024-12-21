import React from "react";
import { Box, IconButton, Badge } from "@mui/material";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import { useNavigate } from "react-router-dom";

const Header = ({ cartCount }) => {
  const navigate = useNavigate();

  return (
    <Box className="header">
      <h1 style={{ cursor: "pointer" }} onClick={() => navigate("/")}>
        Vishal Mart
      </h1>
      <IconButton onClick={() => navigate("/cart")}> {/* Navigate to cart page */}
        <Badge badgeContent={cartCount} color="secondary">
          <ShoppingCartIcon />
        </Badge>
      </IconButton>
    </Box>
  );
};

export default Header;
