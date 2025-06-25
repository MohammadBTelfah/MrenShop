import React from "react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Button } from "@mui/material";
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';


export default function Products() {
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get("http://127.0.1:5003/api/products/getallproduct");
        setProducts(response.data);
      } catch (error) {
        console.error("Error fetching products:", error);
        // Optionally, you can redirect to login or show an error message
        navigate('/login');
      }
    };
    fetchProducts();
  }, [navigate]);

  return (
    <div>
      <h1>Products</h1>
      <div className="products-list">
        {products.map((product) => (
          <Box key={product._id} sx={{ border: '1px solid #ccc', padding: 2, margin: 2 }}>
            <Typography variant="h6">{product.name}</Typography>
            <Typography variant="body1">{product.description}</Typography>
            <Typography variant="body2">Price: ${product.price}</Typography>
            {product.image && <img src={product.image} alt={product.name} width={100} />}
          </Box>
        ))}
      </div>
    </div>
  );

}