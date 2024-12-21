import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ProductTable from "./DataGridDemo"; // Import updated ProductTable component
import ProductDetails from "./ProductDetails";
//import { CartProvider } from "./CartContext";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<ProductTable />} />
        <Route path="/product/:id" element={<ProductDetails />} />
      </Routes>
    </Router>
  );
}

export default App;
